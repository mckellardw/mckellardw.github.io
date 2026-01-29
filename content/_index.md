---
title: "David W. McKellar"
---

<style>
	/* Scoped styles for the homepage avatar */
	.home-avatar {
		float: left;
		height: 180px;
		width: auto;
		border-radius: 12px;
		margin: 0 24px 16px 0;
	}
	@media (max-width: 640px) {
		.home-avatar {
			float: none;
			display: block;
			margin: 0 auto 16px auto;
			height: 140px;
		}
	}
	/* Standardize border-radius and match text box colors */
	.btn-colorful {
		border-radius: 12px !important;
		background-color: var(--tw-prose-pre-bg) !important;
		color: var(--tw-prose-pre-code) !important;
		transition: background-color 0.2s ease, transform 0.2s ease;
	}
	.btn-colorful:hover {
		transform: scale(1.1);
	}
	/* Code block styling */
	.prose pre {
		border-radius: 12px !important;
	}
	/* Custom info box to replace code block */
	.info-box {
		background-color: var(--tw-prose-pre-bg);
		color: var(--tw-prose-pre-code);
		border-radius: 12px;
		padding: 1em;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.875em;
		line-height: 1.7;
		margin: 1em 0;
		overflow: hidden; /* Creates new block formatting context to not overlap floated image */
	}
	.info-box a {
		color: inherit;
		text-decoration: none;
		transition: color 0.2s ease, font-weight 0.2s ease, font-size 0.2s ease;
		display: inline-block;
	}
	.info-box a:hover {
		font-weight: bold;
		font-size: 1.05em;
	}
	/* Horizontal separator */
	.separator {
		border: none;
		border-top: 6px solid var(--tw-prose-hr);
		margin: 2em 0;
		opacity: 0.5;
	}
	/* Bio box styling */
	.bio-box {
		background-color: var(--tw-prose-pre-bg);
		color: var(--tw-prose-pre-code);
		border-radius: 12px;
		padding: 1.25em;
		line-height: 1.7;
		margin: 1em 0;
		text-align: justify;
	}
	.bio-box p {
		margin: 0 0 1em 0;
	}
	.bio-box p:last-child {
		margin-bottom: 0;
	}
</style>

<script>
	document.addEventListener('DOMContentLoaded', function() {
		const btn = document.querySelector('.btn-colorful');
		const colors = ['#5A93E8', '#D9615A', '#4D9E62', '#E8B42A'];

		btn.addEventListener('mouseenter', function() {
			const randomColor = colors[Math.floor(Math.random() * colors.length)];
			btn.style.setProperty('background-color', randomColor, 'important');
		});

		btn.addEventListener('mouseleave', function() {
			btn.style.setProperty('background-color', 'var(--tw-prose-pre-bg)', 'important');
		});

		// Random color effect for romixbio link
		const romixLink = document.querySelector('.info-box a');
		if (romixLink) {
			romixLink.addEventListener('mouseenter', function() {
				const randomColor = colors[Math.floor(Math.random() * colors.length)];
				romixLink.style.color = randomColor;
			});

			romixLink.addEventListener('mouseleave', function() {
				romixLink.style.color = '';
			});
		}

		// Random color effect for Publications nav link
		const pubLink = document.querySelector('.nav-wrapper nav a');
		if (pubLink) {
			pubLink.addEventListener('mouseenter', function() {
				const randomColor = colors[Math.floor(Math.random() * colors.length)];
				pubLink.style.color = randomColor;
			});

			pubLink.addEventListener('mouseleave', function() {
				pubLink.style.color = '';
			});
		}

		// Random color effect for social icons in header
		// CSS filters to colorize white SVG icons to match button colors
		const colorFilters = [
			'brightness(0) saturate(100%) invert(58%) sepia(52%) saturate(553%) hue-rotate(190deg) brightness(94%) contrast(87%)', // Blue #5A93E8
			'brightness(0) saturate(100%) invert(48%) sepia(67%) saturate(487%) hue-rotate(324deg) brightness(92%) contrast(89%)', // Red #D9615A
			'brightness(0) saturate(100%) invert(56%) sepia(20%) saturate(1069%) hue-rotate(85deg) brightness(94%) contrast(85%)', // Green #4D9E62
			'brightness(0) saturate(100%) invert(72%) sepia(47%) saturate(762%) hue-rotate(8deg) brightness(97%) contrast(88%)'   // Yellow #E8B42A
		];
		const socialIcons = document.querySelectorAll('.nav-wrapper nav:last-child a');
		socialIcons.forEach(function(icon) {
			icon.addEventListener('mouseenter', function() {
				const randomFilter = colorFilters[Math.floor(Math.random() * colorFilters.length)];
				icon.style.filter = randomFilter;
			});

			icon.addEventListener('mouseleave', function() {
				icon.style.filter = '';
			});
		});
	});
</script>

<img src="/images/prof_pic.jpg" alt="Portrait of David W. McKellar" class="home-avatar" loading="eager" />


<div class="info-box">
Co-founder & CTO<br>
Romix Biosciences<br>
david [at] <a href="https://romixbio.com/" target="_blank" rel="noopener">romixbio [dot] com</a>
</div>  

<a href="https://scheduler.zoom.us/david-mckellar/book-a-meeting-w-david" class="btn btn-colorful" target="_blank" rel="noopener">book a call w/ me</a>

<hr class="separator">

<div class="bio-box">
<p>I build new/better ways to measure RNA molecules. In the past, that has mostly focused on spatial technologies. Now, I want to make the best RNA tech available to patients. I think better tools make better data, and better data makes better medicines.</p>
</div>