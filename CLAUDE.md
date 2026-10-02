# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing site for TrailTeam (a Salesforce development consultancy), served from GitHub Pages at the custom domain in `CNAME` (`trailteam.dev`), repo `TrailTeam/business-site`. It is one landing page (`index.html`) plus two small sections: articles under `articles/` and vacancies under `careers/`.

## Build / test / run

There is no build system, package manager, dependency, or test suite. The HTML files in the repo are the deployed artifacts, byte for byte.

- Preview: `node .claude/serve.js` (dependency-free static server on :4173), or the `site` config in `.claude/launch.json`. Opening `index.html` over `file://` also works, minus correct MIME types.
- Deploy: push to `main`. GitHub Pages publishes the repo root; there is no CI step, so a bad commit on `main` is live immediately.
- `CNAME` must stay at the repo root with the bare domain — GitHub Pages rewrites or drops it when the Pages custom-domain setting is edited in the UI, which is why its history shows create/delete churn.

## Architecture

Every page is hand-written HTML that links the same two shared files: `site.css` (the full stylesheet, tokens included) and `site.js` (the theme toggle, loaded with `defer`). They were inline in `index.html` while the site was a single page and were extracted when the articles were added, so the tokens exist in exactly one place. Do not add further CSS or JS files without a reason — a page is its HTML, those two files and images. The only external dependency is the Roboto webfont from Google Fonts.

The one script that stays inline in every page's `<head>` is the five-line theme restore, because it has to run before first paint.

Navigation has two levels, and they must not be mixed. The header's `.site-nav` is the main menu and lists pages only — Home, Articles, Careers and Contact Us — identically on every page. The header carries no email link: Contact Us replaced it, and the only other thing in the header is the theme toggle. The landing page's sections (Services, Process, Certifications, Contact) are in-page anchors, so they live in a separate `.page-nav` strip directly under the header of `index.html` and appear nowhere else. A new top-level page goes in `.site-nav`; a new landing-page section goes in `.page-nav`. The current item is marked with `aria-current`: `"page"` on the page itself, `"true"` on Articles or Careers while one of their sub-pages is open.

The header and footer markup is duplicated in each page (there is no templating). A change to the main menu has to be made in `index.html`, both listings and every article and vacancy. Pages under `articles/` and `careers/` reach the root with `../` — relative, not root-absolute, so nothing depends on the site living at a domain root. `url()` values in `site.css` resolve against the stylesheet, so the token-driven images work from any depth.

Layout is a `.wrap` container (max-width 1080px, 16px gutters) holding stacked sections. The hero is a one-column grid that becomes two columns at 860px, and the header and process steps switch at 760px. Article and careers pages put their content in a narrower `.reading` column (760px) centred inside `.wrap`.

### Articles

`articles/index.html` is the listing; each article is one flat file, `articles/<slug>.html`, with its body inside `.prose` (headings, lists, tables, inline `code` and `pre` blocks).

How to add and format an article is specified in `.claude/rules/articles.md` — structure, the meta line (topic, level, audience, reading time), voice and markup. The two rules most easily broken: a new article's card always goes first in the listing, and articles carry no publication date.

### Careers

`careers/index.html` lists the vacancies; each one is a flat file, `careers/<slug>.html`. The pages reuse the articles' building blocks (`.reading`, `.article-list` cards, `.prose`) and add only a status pill (`.status` with `.status-open` in the accent colour or `.status-closed` in soft red, from the `--closed` / `--closed-bg` tokens) and a `.notice` box.

How to add and format a vacancy is specified in `.claude/rules/careers.md`. The rules most easily broken: the status (open or closed) has to agree in every place it appears, vacancies carry no dates, and nothing about the terms of a job — salary, benefits, contract type — is written unless the team supplied it.

### Theming

Dark is the default set of custom properties on `:root`, and the site deliberately does not consult `prefers-color-scheme` — a visitor whose OS is set to light still lands on the dark site. Light is one override block, `:root[data-theme="light"]`, applied only when the visitor picks it.

The sun/moon button writes `light`/`dark` to `localStorage` and sets `data-theme` on `<html>`. A tiny script in `<head>` re-applies the stored value before first paint, so there is no flash; every `localStorage` access is wrapped in try/catch because it throws in some privacy modes. Clearing the stored key returns the visitor to the dark default.

`color-scheme` is declared next to the tokens in both blocks so scrollbars and native controls match the theme, and the single `theme-color` meta tag is rewritten by the toggle script.

Everything themeable goes through tokens, including the illustrations (`--hero-art`, `--team-art`, `--logo-art`, `--contact-art`, `--art-bg`, `--art-border`). Hard-coded hex outside those two blocks will break one of the two theme paths.

The brand palette is sampled from the logo artwork: teal `#48c0c8`, violet `#6058a0`, deep teal `#086078`, purple `#603080`.

## Images

All images live under `images/`: the served files at its top level, the nine certification badges in `images/certs/`, and the originals in `images/src/`. Nothing in `images/src/` is referenced by a page — those files exist only as input for `.claude/build-images.js`, and every served file was reviewed for use when the folder was created (2026-10-03): there are no orphaned images, so do not delete anything there as "unused" without checking the build script first. `url()` values in `site.css` are relative to the stylesheet at the repo root, so they read `images/…`; pages one level down use `../images/…`; `og:image` is the absolute `https://trailteam.dev/images/og.png`.

Served assets are derived, not hand-made. The originals are the two full-resolution banners `images/src/header_1.png` (6092×4000) and `images/src/header2.png`, which have marketing copy and the wordmark baked into the pixels.

- `hero.webp`, `team.webp`, `logo.png`, `og.png` are generated from those banners by `.claude/build-images.js` (needs `sharp`; run it with `node .claude/build-images.js`): white rectangles painted over the baked-in text, then trim, resize and encode. The patch coordinates were measured by scanning the originals for ink columns/rows — if a banner is ever replaced, those coordinates must be re-measured, not guessed.
- Keep headline copy in HTML, never in an image. The baked-in text was removed precisely so it is indexable, translatable and legible on a phone.
- `apple-touch-icon.png` (180×180) is the bracket mark flattened onto white — iOS renders transparency as black — with padding so rounded corners do not clip it. Rebuilding it needs the original 2048×2048 favicon recovered first: `git show fd81f06:favicon.png > images/src/favicon-src.png`.
- `og.png` (1200×630) is the social preview and is the one place the original banner is used intact, text and all. It is referenced only by meta tags, so it does not count toward page weight.
- The contact page illustration is the exception to all of the above: `images/src/contact_us.jfif` (line art on white) and `images/src/contact_us_dark.jfif` (the same scene redrawn on a dark gradient) are two separate originals supplied by the team, 1100×976 like the hero. `build-images.js` only re-encodes them to `contact.webp` / `contact-dark.webp`; there is nothing to patch or knock out. Because the dark copy brings its own background, `.art-contact` drops the card padding and uses `background-size: cover`, so the gradient fills the rounded box.
- Each illustration ships twice. The light copies (`hero.webp`, `team.webp`, `logo.png`) are the original line art on white, shown on a white card. The dark copies (`hero-dark.webp`, `team-dark.webp`, `logo-dark.png`) have the white knocked out to alpha so the art sits straight on the page with no card.
- The knockout ramps alpha from the pixel's darkest channel, so anti-aliased edges stay smooth. Run it on the lossless original, never on an already-encoded WebP — compression noise near white turns into visible speckle.
- `logo-dark.png` additionally lifts strokes darker than `#bebebe` up to a 205 peak channel, keeping hue. Without it the dark-teal "TRAIL" and purple "TEAM" disappear against the dark background. The illustrations do not need this lift; their outlines are already bright.

Served weight is about 285 KB in dark, which is what almost everyone gets now that dark is the default, and 230 KB in light (the alpha channel costs ~50 KB); 85 KB of either is the nine certification badges, lazy-loaded below the fold. Because the illustrations are CSS `background-image` driven by tokens, a visitor only downloads the variant for their active theme. It was ~10 MB before optimization; keep new assets in that budget.

## Crawler files

`robots.txt` allows everything and points at `sitemap.xml`, which lists the landing page, both listings, each article and each vacancy. Every entry carries a hard-coded `<lastmod>`; update it when that page's content changes materially, or drop the element rather than let it go stale.

## Content status

On the landing page: contact email (`contactus@trailteam.dev`, in the CTA and the footer), ten service cards, a four-step process, nine Salesforce certifications, and small-team positioning in the team section.

`contact/index.html` is the Contact Us page. It opens with the same `.hero` grid as the landing page (heading and lede beside the contact illustration), then a `.reading` column. Its panel repeats the landing page's `#contact` section word for word — change one, change the other — and adds what to put in a first message, what happens next (the first steps of the landing page's process, same wording) and a pointer to Careers. It promises no response time, phone number or office address because none has been supplied; do not add them.

The five articles (governor limits, wire vs imperative Apex in LWC, callout checklist, testing permissions for QA, and the Winter '27 release overview) were drafted by Claude on 2026-10-02 and 2026-10-03 and need a technical read-through by the team before they are pushed. The release overview was checked against the official Winter '27 release notes; the other four were written from memory. The callout checklist still quotes 6 MB / 12 MB as the maximum callout body size, which mirrored the old heap limits — whether Winter '27 raised it along with the heap was not verified. Articles are general technical guidance and follow the same rule as the rest of the site: no invented projects, clients or "in our experience at…" anecdotes.

**TrailTeam has no clients yet.** There are no case studies, testimonials, client logos or delivery numbers, and none may be invented — not as placeholders, not as examples. The site compensates with things that are true today: certifications, a concrete service list, a transparent process, and a free first call. If asked for social proof, say what is missing rather than filling it in.

The careers section holds two vacancies, Salesforce Developer (Middle/Senior, full-time, remote) for LATAM and for Poland. Both are closed: the team reported the positions as filled on 2026-10-02 and asked for them to stay on the site marked as closed, with a status tag that reads just "Closed". The listing invites Salesforce specialists to send a CV to `careers@trailteam.dev` (the candidates' address, separate from `contactus@trailteam.dev`) and promises a notification when a position opens. Their descriptions are a deliberately standard Salesforce developer profile with no further terms (salary, benefits, contract type) because none were supplied.

Team size is deliberately omitted — do not add it. Still open: whether the engineers' prior Salesforce experience at previous employers can be cited (it would be the strongest available substitute for case studies), and whether the site needs a second language.

Certification names are rendered short ("Platform Data Architect") because the section heading already says "Salesforce certifications". The strings came from the team verbatim and match the wording on the official badge artwork, so they are not typos to fix even where Salesforce has since renamed a credential.

Certification badges in `images/certs/` are Salesforce's official artwork, supplied by the team (500x490 PNG, re-encoded to 192px WebP with alpha). They are decorative: each `<img>` carries `alt=""` because the credential name sits in visible text beside it. The Trailblazer profile itself is behind a login, so replacements have to come from the team, not from the web.

`og.png` still carries the old "Tailored Software Solutions for the Digital Era" tagline baked into the original banner, while the page now leads with Salesforce. Regenerating it needs new banner artwork.
