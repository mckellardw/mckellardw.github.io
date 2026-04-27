# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic/professional website for David W. McKellar built with Hugo and deployed to GitHub Pages. Live at https://mckellardw.github.io/

## Development Commands

Local development uses a conda environment named `hugo`:

```bash
# Activate conda environment
conda activate hugo

# Run local development server
bash serve.sh
# Or manually:
hugo server -D

# Production build
hugo --gc --minify
```

## Deployment

Automated via GitHub Actions on push to `main` branch. The workflow (`.github/workflows/hugo.yaml`) builds with Hugo v0.148.1 extended and Dart Sass v1.89.2.

## Architecture

**Hugo Theme**: `hugo-paper` (git submodule in `themes/hugo-paper/`)
- Clone with `--recursive` to fetch theme

**Custom Layouts** (override theme defaults):
- `layouts/index.html` - Custom homepage with profile styling
- `layouts/_default/baseof.html`, `layouts/_default/single.html` - Base/single templates
- `layouts/partials/{head,header,footer}.html` - Site chrome partials
- `assets/custom.css` - Ubuntu font + social icon hover styles

**Content Structure**:
- `content/_index.md` - Homepage content
- `content/publications/index.md` - Publications page
- `static/images/` - Profile pictures and graphics
- `static/pdfs/` - Research PDFs

## Configuration

Main config in `config.toml`:
- Theme: `hugo-paper` with dark color scheme
- Markdown rendering allows raw HTML (`unsafe = true`)
- Single menu item: Publications
