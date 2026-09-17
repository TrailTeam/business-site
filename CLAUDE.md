# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page static marketing site for TrailTeam (a Salesforce development consultancy), served from GitHub Pages at the custom domain in `CNAME` (`trailteam.dev`), repo `TrailTeam/business-site`.

## Build / test / run

There is no build system, package manager, dependency, or test suite. `index.html` is the deployed artifact, byte for byte.

- Preview: `node .claude/serve.js` (dependency-free static server on :4173), or the `site` config in `.claude/launch.json`. Opening `index.html` over `file://` also works, minus correct MIME types.
- Deploy: push to `main`. GitHub Pages publishes the repo root; there is no CI step, so a bad commit on `main` is live immediately.
- `CNAME` must stay at the repo root with the bare domain — GitHub Pages rewrites or drops it when the Pages custom-domain setting is edited in the UI, which is why its history shows create/delete churn.

## Architecture

Everything is in `index.html`: markup, the full stylesheet in one inline `<style>` block, and two small inline scripts. No external CSS or JS file, and none should be added without a reason — the site is one HTTP request plus images. The only external dependency is the Roboto webfont from Google Fonts.

Layout is a `.wrap` container (max-width 1080px, 16px gutters) holding stacked sections. The hero is a one-column grid that becomes two columns at 860px. Nothing else is breakpoint-dependent.

### Theming

Light is the default set of custom properties on `:root`. The dark set is written twice, and both copies must be kept in sync:

- `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` — follows the OS unless the visitor forced light.
- `:root[data-theme="dark"] { … }` — an explicit choice from the toggle.

The sun/moon button writes `light`/`dark` to `localStorage` and sets `data-theme` on `<html>`. A tiny script in `<head>` re-applies the stored value before first paint, so there is no flash; every `localStorage` access is wrapped in try/catch because it throws in some privacy modes. Removing the stored key returns the visitor to following their OS.

Everything themeable goes through tokens, including the illustrations (`--hero-art`, `--team-art`, `--logo-art`, `--art-bg`, `--art-border`). Hard-coded hex outside `:root` will break one of the three theme paths.

The brand palette is sampled from the logo artwork: teal `#48c0c8`, violet `#6058a0`, deep teal `#086078`, purple `#603080`.

## Images

Served assets are derived, not hand-made. The originals are the two full-resolution banners `header_1.png` (6092×4000) and `header2.png`, which have marketing copy and the wordmark baked into the pixels.

- `hero.webp`, `team.webp`, `logo.png`, `og.png` are generated from those banners by `.claude/build-images.js` (needs `sharp`; run it with `node .claude/build-images.js`): white rectangles painted over the baked-in text, then trim, resize and encode. The patch coordinates were measured by scanning the originals for ink columns/rows — if a banner is ever replaced, those coordinates must be re-measured, not guessed.
- Keep headline copy in HTML, never in an image. The baked-in text was removed precisely so it is indexable, translatable and legible on a phone.
- `apple-touch-icon.png` (180×180) is the bracket mark flattened onto white — iOS renders transparency as black — with padding so rounded corners do not clip it. Rebuilding it needs the original 2048×2048 favicon recovered first: `git show fd81f06:favicon.png > favicon-src.png`.
- `og.png` (1200×630) is the social preview and is the one place the original banner is used intact, text and all. It is referenced only by meta tags, so it does not count toward page weight.
- Each illustration ships twice. The light copies (`hero.webp`, `team.webp`, `logo.png`) are the original line art on white, shown on a white card. The dark copies (`hero-dark.webp`, `team-dark.webp`, `logo-dark.png`) have the white knocked out to alpha so the art sits straight on the page with no card.
- The knockout ramps alpha from the pixel's darkest channel, so anti-aliased edges stay smooth. Run it on the lossless original, never on an already-encoded WebP — compression noise near white turns into visible speckle.
- `logo-dark.png` additionally lifts strokes darker than `#bebebe` up to a 205 peak channel, keeping hue. Without it the dark-teal "TRAIL" and purple "TEAM" disappear against the dark background. The illustrations do not need this lift; their outlines are already bright.

Served weight is about 230 KB in light mode and 285 KB in dark (the alpha channel costs ~50 KB); 85 KB of either is the nine certification badges, lazy-loaded below the fold. Because the illustrations are CSS `background-image` driven by tokens, a visitor only downloads the variant for their active theme. It was ~10 MB before optimization; keep new assets in that budget.

## Crawler files

`robots.txt` allows everything and points at `sitemap.xml`, which lists the single page. The sitemap carries a hard-coded `<lastmod>`; update it when the page content changes materially, or drop the element rather than let it go stale.

## Content status

On the page: contact email (`contactus@trailteam.dev`, in the header, the CTA and the footer), ten service cards, a four-step process, nine Salesforce certifications, and small-team positioning in the team section.

**TrailTeam has no clients yet.** There are no case studies, testimonials, client logos or delivery numbers, and none may be invented — not as placeholders, not as examples. The site compensates with things that are true today: certifications, a concrete service list, a transparent process, and a free first call. If asked for social proof, say what is missing rather than filling it in.

Team size is deliberately omitted — do not add it. Still open: whether the engineers' prior Salesforce experience at previous employers can be cited (it would be the strongest available substitute for case studies), and whether the site needs a second language.

Certification names are rendered short ("Platform Data Architect") because the section heading already says "Salesforce certifications". The strings came from the team verbatim and match the wording on the official badge artwork, so they are not typos to fix even where Salesforce has since renamed a credential.

Certification badges in `certs/` are Salesforce's official artwork, supplied by the team (500x490 PNG, re-encoded to 192px WebP with alpha). They are decorative: each `<img>` carries `alt=""` because the credential name sits in visible text beside it. The Trailblazer profile itself is behind a login, so replacements have to come from the team, not from the web.

`og.png` still carries the old "Tailored Software Solutions for the Digital Era" tagline baked into the original banner, while the page now leads with Salesforce. Regenerating it needs new banner artwork.
