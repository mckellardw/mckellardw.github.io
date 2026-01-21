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
	});
</script>

<img src="/images/prof_pic.jpg" alt="Portrait of David W. McKellar" class="home-avatar" loading="eager" />


```
Co-founder & CTO
Romix Biosciences
david [at] romixbio [dot] com  
```  

<a href="https://scheduler.zoom.us/david-mckellar/book-a-meeting-w-david" class="btn btn-colorful" target="_blank" rel="noopener">book a call w/ me</a>