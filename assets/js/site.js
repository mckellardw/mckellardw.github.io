(function () {
  'use strict';

  var canvas = document.querySelector('.paint-background');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var hoverColors = ['#7fa8b0', '#91aea0', '#aaa2be', '#c0989c', '#cfaa91', '#b9ae82'];
  var paintColors = [
    [0.169, 0.259, 0.294],
    [0.196, 0.322, 0.345],
    [0.220, 0.357, 0.325],
    [0.306, 0.310, 0.404],
    [0.396, 0.298, 0.322],
    [0.467, 0.388, 0.341],
    [0.357, 0.369, 0.275],
    [0.510, 0.475, 0.435]
  ];
  var gl = canvas && (canvas.getContext('webgl', { alpha: true, antialias: false }) ||
    canvas.getContext('experimental-webgl', { alpha: true, antialias: false }));
  var program;
  var pointBuffer;
  var uniforms = {};
  var pointData;
  var driftAngles;
  var pointCount = 0;
  var ratio = 1;
  var width = 0;
  var height = 0;
  var lastFrame = 0;
  var start = performance.now();
  var pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
    attracting: false,
    attractionStartedAt: 0
  };
  var seed = 24871;
  var storageKey = 'mckellardw-paint-state-v1';

  var vertexSource = [
    'attribute vec2 a_position;',
    'attribute float a_depth;',
    'attribute float a_size;',
    'attribute vec3 a_color;',
    'attribute float a_alpha;',
    'attribute float a_shape;',
    'uniform vec2 u_resolution;',
    'uniform float u_ratio;',
    'varying vec3 v_color;',
    'varying float v_alpha;',
    'varying float v_shape;',
    'void main() {',
    '  vec2 pixel = a_position * u_resolution;',
    '  vec2 clip = pixel / u_resolution * 2.0 - 1.0;',
    '  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);',
    '  gl_PointSize = a_size * u_ratio;',
    '  v_color = a_color;',
    '  v_alpha = a_alpha;',
    '  v_shape = a_shape;',
    '}'
  ].join('\n');

  var fragmentSource = [
    'precision mediump float;',
    'varying vec3 v_color;',
    'varying float v_alpha;',
    'varying float v_shape;',
    'void main() {',
    '  vec2 p = gl_PointCoord * 2.0 - 1.0;',
    '  float angle = atan(p.y, p.x);',
    '  float distanceFromCenter = length(p);',
    '  float edge = 0.78',
    '    + sin(angle * 2.0 + v_shape * 6.2831) * 0.09',
    '    + sin(angle * 5.0 - v_shape * 4.7) * 0.055',
    '    + cos(angle * 7.0 + v_shape * 8.1) * 0.025;',
    '  float mask = 1.0 - smoothstep(edge - 0.12, edge, distanceFromCenter);',
    '  float pigment = mix(0.88, 1.0, 1.0 - distanceFromCenter);',
    '  float alpha = mask * v_alpha * pigment;',
    '  if (alpha < 0.015) discard;',
    '  gl_FragColor = vec4(v_color, alpha);',
    '}'
  ].join('\n');

  document.documentElement.classList.remove('not-ready');

  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  function compileShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram() {
    var vertex = compileShader(gl.VERTEX_SHADER, vertexSource);
    var fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      return null;
    }
    var result = gl.createProgram();
    gl.attachShader(result, vertex);
    gl.attachShader(result, fragment);
    gl.linkProgram(result);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return gl.getProgramParameter(result, gl.LINK_STATUS) ? result : null;
  }

  function chooseColorIndex(x, y) {
    var centerLight = x > 0.28 && x < 0.78 && y < 0.58;
    var rightVegetation = x > 0.68;
    var pool = centerLight ? [2, 3, 5, 7] : rightVegetation ? [0, 2, 4, 6] : [0, 1, 2, 3, 6];
    return pool[Math.floor(random() * pool.length)];
  }

  function buildPoints() {
    seed = 24871;
    var mobileViewport = width < 700;
    var minimum = mobileViewport ? 3600 : 7200;
    var maximum = mobileViewport ? 7200 : 14400;
    pointCount = Math.max(minimum, Math.min(maximum, Math.round(width * height / 130)));
    var stride = 10;
    pointData = new Float32Array(pointCount * stride);
    driftAngles = new Float32Array(pointCount);

    for (var i = 0; i < pointCount; i += 1) {
      var offset = i * stride;
      var x = random();
      var y = random();
      var reflection = x > 0.27 && x < 0.8 && y < 0.62 && random() < 0.3;
      var colorIndex = reflection ? (random() < 0.58 ? 7 : 5) : chooseColorIndex(x, y);
      var depth = 0.08 + Math.pow(random(), 1.45) * 0.92;
      // A skewed distribution creates many small flecks and occasional large,
      // close dabs instead of clustering every particle around one scale.
      var sizeVariation = Math.pow(random(), 2.2);
      var radius = (
        0.256 +
        Math.pow(depth, 1.65) * 6.96 +
        sizeVariation * 4.08
      ) * (width / 1600 + 0.55);
      var color = paintColors[colorIndex];

      pointData[offset] = x;
      pointData[offset + 1] = y;
      pointData[offset + 2] = depth;
      pointData[offset + 3] = radius * 2.75;
      pointData[offset + 4] = color[0];
      pointData[offset + 5] = color[1];
      pointData[offset + 6] = color[2];
      pointData[offset + 7] = 0.13 + depth * 0.35 + random() * 0.1;
      pointData[offset + 8] = random() * Math.PI * 2;
      pointData[offset + 9] = random();
      driftAngles[i] = random() * Math.PI * 2;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.DYNAMIC_DRAW);
    restorePointState();
  }

  function encodeFloatArray(values) {
    var bytes = new Uint8Array(values.buffer);
    var binary = '';
    var chunkSize = 8192;
    for (var i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return window.btoa(binary);
  }

  function decodeFloatArray(value) {
    var binary = window.atob(value);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Float32Array(bytes.buffer);
  }

  function savePointState() {
    if (!pointData || !driftAngles) {
      return;
    }
    var positions = new Float32Array(pointCount * 2);
    for (var i = 0; i < pointCount; i += 1) {
      positions[i * 2] = pointData[i * 10];
      positions[i * 2 + 1] = pointData[i * 10 + 1];
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        count: pointCount,
        positions: encodeFloatArray(positions),
        angles: encodeFloatArray(driftAngles)
      }));
    } catch (error) {
      // Storage can be unavailable in strict privacy modes; animation still works.
    }
  }

  function restorePointState() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey));
      if (!saved || saved.count !== pointCount) {
        return;
      }
      var positions = decodeFloatArray(saved.positions);
      var angles = decodeFloatArray(saved.angles);
      if (positions.length !== pointCount * 2 || angles.length !== pointCount) {
        return;
      }
      for (var i = 0; i < pointCount; i += 1) {
        pointData[i * 10] = positions[i * 2];
        pointData[i * 10 + 1] = positions[i * 2 + 1];
      }
      driftAngles.set(angles);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pointData);
    } catch (error) {
      try {
        window.localStorage.removeItem(storageKey);
      } catch (storageError) {
        // Ignore storage restrictions.
      }
    }
  }

  function bindAttribute(name, size, offset) {
    var location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 40, offset * 4);
  }

  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 1.35);
    width = window.innerWidth + 64;
    height = window.innerHeight + 64;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    buildPoints();

    if (!pointer.active) {
      pointer.x = pointer.targetX = width * 0.52;
      pointer.y = pointer.targetY = height * 0.4;
    }
    if (reduceMotion) {
      draw(performance.now(), true);
    }
  }

  function draw(now, force) {
    if (!force && now - lastFrame < 16) {
      window.requestAnimationFrame(draw);
      return;
    }
    var elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
    lastFrame = now;
    // 0.18 halves the response time versus the previous 0.09 easing rate.
    pointer.x += (pointer.targetX - pointer.x) * 0.18;
    pointer.y += (pointer.targetY - pointer.y) * 0.18;

    if (!reduceMotion && elapsed > 0) {
      updatePointPositions((now - start) / 1000, elapsed);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pointData);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uniforms.resolution, width, height);
    gl.uniform1f(uniforms.ratio, ratio);
    gl.drawArrays(gl.POINTS, 0, pointCount);

    if (!reduceMotion) {
      window.requestAnimationFrame(draw);
    }
  }

  function updatePointPositions(time, elapsed) {
    var stride = 10;
    var cursorRadius = 320;
    var attractionMultiplier = 1;

    if (pointer.attracting && pointer.attractionStartedAt) {
      var heldFor = Math.max(0, time - pointer.attractionStartedAt);
      var charge = Math.min(heldFor / 3, 1);
      // Ease-in acceleration: subtle at first, then increasingly strong.
      attractionMultiplier = 1 + charge * charge * 2;
    }

    for (var i = 0; i < pointCount; i += 1) {
      var offset = i * stride;
      var depth = pointData[offset + 2];
      var renderedDiameter = pointData[offset + 3];
      // Mass follows rendered area. Clamp the extremes so tiny paint flecks
      // remain controllable and the largest dabs still respond visibly.
      var mass = Math.max(0.18, Math.min(6.5, Math.pow(renderedDiameter / 11, 2)));
      var inverseSqrtMass = 1 / Math.sqrt(mass);
      var inverseMass = 1 / mass;
      var phase = pointData[offset + 8];

      // Slowly varying headings create persistent Brownian-like wandering.
      driftAngles[i] += (
        Math.sin(time * 0.31 + phase * 1.7) +
        Math.cos(time * 0.17 + phase * 2.3)
      ) * elapsed * 0.24 * inverseSqrtMass;
      // Brownian speed varies with inverse square-root mass: small pigment
      // flecks wander quickly while broad, heavy dabs move more deliberately.
      var driftSpeed = (0.7 + depth * 5.5) * 1.1 * inverseSqrtMass;
      var x = pointData[offset] * width + Math.cos(driftAngles[i]) * driftSpeed * elapsed;
      var y = pointData[offset + 1] * height + Math.sin(driftAngles[i]) * driftSpeed * elapsed;

      if (pointer.active) {
        var dx = x - pointer.x;
        var dy = y - pointer.y;
        // Reject most points before paying for a square root.
        if (Math.abs(dx) < cursorRadius && Math.abs(dy) < cursorRadius) {
          var distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < cursorRadius * cursorRadius) {
            var distance = Math.sqrt(distanceSquared) || 1;
          var influence = 1 - distance / cursorRadius;
          // Cursor force becomes acceleration through inverse mass.
          var forceSpeed = influence * influence * (18 + depth * 105) * inverseMass;
          var forceDirection = pointer.attracting ? -1 : 1;
          if (pointer.attracting) {
            forceSpeed *= attractionMultiplier;
          }
          x += dx / distance * forceSpeed * forceDirection * elapsed;
          y += dy / distance * forceSpeed * forceDirection * elapsed;
          }
        }
      }

      // Positions persist—there is no origin or spring to return to.
      if (x < -12) x = width + 12;
      if (x > width + 12) x = -12;
      if (y < -12) y = height + 12;
      if (y > height + 12) y = -12;
      pointData[offset] = x / width;
      pointData[offset + 1] = y / height;
    }
  }

  function drawFallback() {
    var fallback = canvas.getContext('2d');
    if (!fallback) {
      return;
    }
    seed = 24871;
    fallback.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < 5000; i += 1) {
      var x = random() * canvas.width;
      var y = random() * canvas.height;
      var color = paintColors[Math.floor(random() * paintColors.length)];
      var radius = 1 + random() * 3;
      fallback.fillStyle = 'rgba(' + Math.round(color[0] * 255) + ',' + Math.round(color[1] * 255) + ',' + Math.round(color[2] * 255) + ',' + (0.18 + random() * 0.3) + ')';
      fallback.beginPath();
      fallback.ellipse(x, y, radius, radius * (0.55 + random() * 0.7), random() * Math.PI, 0, Math.PI * 2);
      fallback.fill();
    }
  }

  function chooseHoverColor(element) {
    var previous = element.style.getPropertyValue('--hover-accent');
    var choices = hoverColors.filter(function (color) { return color !== previous; });
    element.style.setProperty('--hover-accent', choices[Math.floor(Math.random() * choices.length)]);
  }

  document.querySelectorAll('.wordmark, .btn-colorful, .nav-link, .info-box a, .social-icon, .author-highlight, .background-reset').forEach(function (element) {
    element.addEventListener('pointerenter', function () { chooseHoverColor(element); });
    element.addEventListener('focus', function () { chooseHoverColor(element); });
  });

  if (!gl) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFallback();
    return;
  }

  program = createProgram();
  if (!program) {
    return;
  }
  pointBuffer = gl.createBuffer();
  gl.useProgram(program);
  uniforms.resolution = gl.getUniformLocation(program, 'u_resolution');
  uniforms.ratio = gl.getUniformLocation(program, 'u_ratio');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  bindAttribute('a_position', 2, 0);
  bindAttribute('a_depth', 1, 2);
  bindAttribute('a_size', 1, 3);
  bindAttribute('a_color', 3, 4);
  bindAttribute('a_alpha', 1, 7);
  bindAttribute('a_shape', 1, 9);

  var resetButton = document.querySelector('.background-reset');
  if (resetButton) {
    resetButton.addEventListener('click', function () {
      try {
        window.localStorage.removeItem(storageKey);
      } catch (error) {
        // Reset still succeeds in memory when persistent storage is unavailable.
      }
      pointer.active = false;
      pointer.attracting = false;
      pointer.attractionStartedAt = 0;
      buildPoints();
    });
  }

  if (finePointer && !reduceMotion) {
    window.addEventListener('pointermove', function (event) {
      pointer.targetX = event.clientX + 32;
      pointer.targetY = event.clientY + 32;
      pointer.active = true;
    }, { passive: true });
    window.addEventListener('pointerdown', function (event) {
      if (event.button === 0) {
        pointer.targetX = event.clientX + 32;
        pointer.targetY = event.clientY + 32;
        pointer.active = true;
        pointer.attracting = true;
        pointer.attractionStartedAt = (performance.now() - start) / 1000;
      }
    }, { passive: true });
    window.addEventListener('pointerup', function () {
      pointer.attracting = false;
      pointer.attractionStartedAt = 0;
    }, { passive: true });
    window.addEventListener('pointercancel', function () {
      pointer.attracting = false;
      pointer.attractionStartedAt = 0;
    }, { passive: true });
    window.addEventListener('blur', function () {
      pointer.attracting = false;
      pointer.attractionStartedAt = 0;
    });
    document.documentElement.addEventListener('mouseleave', function () {
      pointer.active = false;
      pointer.attracting = false;
      pointer.attractionStartedAt = 0;
    });
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pagehide', savePointState);
  document.querySelectorAll('.wordmark, .nav-link').forEach(function (link) {
    link.addEventListener('click', savePointState);
  });
  resize();
  if (!reduceMotion) {
    window.requestAnimationFrame(draw);
  }
})();
