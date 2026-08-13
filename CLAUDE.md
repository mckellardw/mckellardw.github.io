# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic/professional website for David W. McKellar built with Hugo and deployed to GitHub Pages. Live at https://mckellardw.github.io/

## Development Commands

Local development uses a conda environment named `hugo`:

```bash
conda activate hugo

# Local dev server
bash serve.sh          # or: hugo server -D

# Production build
hugo --gc --minify
```

Builds on WSL/NTFS are slow (~80s) because of the PDF-heavy `static/` tree — that is expected, not a hang.

## Deployment

Automated via GitHub Actions on push to `main` (`.github/workflows/hugo.yaml`).

## Architecture

**Hugo Theme**: `hugo-paper` (git submodule in `themes/hugo-paper/`) — clone with `--recursive`.

> **Important:** the theme ships a *pre-compiled* Tailwind bundle (`themes/hugo-paper/assets/main.css`). Only utility classes the theme itself already uses exist in it. Adding a new Tailwind class in a layout silently does nothing. Write plain CSS in `assets/custom.css` instead.

**Styling**
- `assets/custom.css` — all site styling. Design tokens live at the top under `:root`; everything else references them.
- `assets/js/site.js` — the only script. Draws the ambient painterly canvas and its cursor interaction.

**Layouts** (override theme defaults)
- `layouts/index.html` — homepage
- `layouts/_default/{baseof,single}.html`
- `layouts/partials/{head,header,footer}.html`

**Conventions**
- Content files are content only — no inline `<style>` or `<script>`. Styling belongs in `custom.css`, behavior in `site.js`.
- Page-specific styling hooks off `<body data-page="...">`, set in `baseof.html` from the URL segment (`home`, `publications`).
- Social links are configured as a `[[params.social]]` array in `config.toml`; icons are inlined SVGs from `assets/icons/` (filled with `currentColor`, so hover recoloring is a plain `color` change).

**Dark mode only.** The `dark` class is hard-set on `<html>` in `baseof.html`; there is no toggle. Don't reintroduce light-mode branches.

The painterly page background uses the fixed canvas in `baseof.html`; `custom.css` composites it behind the page and `site.js` draws and animates it.

## Configuration

Main config in `config.toml`. Markdown rendering allows raw HTML (`unsafe = true`).
