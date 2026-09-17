# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page static marketing site for TrailTeam (a Salesforce development consultancy), served from GitHub Pages at the custom domain in `CNAME` (`trailteam.dev`), repo `TrailTeam/business-site`.

## Build / test / run

There is no build system, package manager, dependency, or test suite — and no tooling config to add one. `index.html` is the deployed artifact, byte for byte.

- Preview: open `index.html` directly in a browser (`start index.html` on Windows), or serve the directory with any static server.
- Deploy: push to `main`. GitHub Pages publishes the repo root; there is no CI step, so a bad commit on `main` is live immediately.
- `CNAME` must stay at the repo root with the bare domain and no trailing newline changes — GitHub Pages rewrites or drops it when the Pages custom-domain setting is edited in the UI, which is why its history shows create/delete churn.

## Architecture

Everything is in `index.html`: markup, the full stylesheet in a single inline `<style>` block, and inline event handlers. There is no external CSS or JS file, and none should be added without a reason — the site is one HTTP request plus images.

The only external dependency is the Roboto webfont from Google Fonts (with `preconnect` hints). Images are committed PNGs at the repo root and referenced by relative path: `header_1.png` (top banner), `header2.png` (projects banner), `favicon.png`.

Layout is a centered flex `body` wrapping a single `.container`; the design is fluid rather than max-width constrained (`.container { max-width: none }`). Dark mode is handled by a single `@media (prefers-color-scheme: dark)` block at the end of the stylesheet that overrides only background and text colors — any new component needs its dark-mode colors added there, since nothing is token-driven.


## Known loose ends in `index.html`

- The logo `<img src="logo.png">` points at a file that is not committed to the repo, so the logo renders as nothing today. Its `onerror` hides the broken image cleanly; committing a `logo.png` at the repo root is all that is needed to make it appear.
