# Articles

Rules for everything under `articles/`. The three existing articles are the reference implementation — when in doubt, open one and copy its shape.

## Order on the listing page

**A new article is always added as the first `<li>` in `<ul class="article-list">` in `articles/index.html`.** The list reads newest-first from the top, and existing cards are never reordered to make room — they just move down. Do not sort by topic, title or level.

## Files to touch when adding an article

1. `articles/<slug>.html` — the article. Flat file, lowercase kebab-case slug that describes the subject (`apex-callout-checklist`), not a number or a date. Start from a copy of an existing article so the `<head>`, header and footer stay identical.
2. `articles/index.html` — a new card, first in the list (see above).
3. `sitemap.xml` — a new `<url>` with the article's canonical address and today's `<lastmod>`.

## No publication dates

Articles carry no visible date, no `<time>` element and no `article:published_time` meta tag. The only date anywhere is `<lastmod>` in `sitemap.xml`.

## The meta line

One line above the title, repeated verbatim on the listing card:

```html
<p class="meta">Integrations &middot; Intermediate &middot; For developers &middot; 5 min read</p>
```

Four parts, always in this order, separated by `&middot;`:

- **Topic** — reuse an existing one (`Apex`, `Lightning Web Components`, `Integrations`) before inventing another. A new topic should correspond to a service card on the landing page (`Testing`, `Data migration`, `Release management`, …).
- **Level** — `Beginner`, `Intermediate` or `Advanced`. Beginner: fundamentals every practitioner on the platform needs. Intermediate: assumes the reader already builds on the platform daily. Advanced: architecture, scale or edge cases.
- **Audience** — `For developers`, `For QA` (not "For testers"), `For project managers`, `For admins` or `For architects`. Name the one group the article is really written for; two joined with "and" is the maximum (release overviews excepted, see below).
- **Reading time** — count every word inside `<article>`, code included, divide by 200, round up: `N min read`. Recount after editing the text; do not guess. The formula gives the starting value for a new article only: a reading time the team has set by hand (as on the callout checklist and the governor limits article) is final and is not recalculated.

## Page structure

```
<main class="reading">
    <a class="back" href="./">&larr; All articles</a>

    <article class="prose">
        <p class="meta">…</p>
        <h1>Title</h1>
        <p class="lede">One or two sentences.</p>
        <div class="rule"></div>

        intro: one or two paragraphs — why the subject matters, no heading
        <h2> sections — five to seven of them
        <h2>In short</h2> — closing recap, a bullet list or one paragraph
    </article>

    <section class="panel contact"> … </section>
</main>
```

- **Title** — sentence case, says what the reader gets. Used unchanged in `<h1>`, `og:title` and the listing card; `<title>` appends ` | TrailTeam`.
- **Lede** — one or two sentences. The same text is the card summary on the listing and the `og:description`. The `<meta name="description">` may be reworded to carry search terms, up to about 160 characters.
- **Sections** — each `<h2>` makes one point; a section is two to four short paragraphs plus, where it helps, one code sample, list or table. Checklist-style articles number the headings (`1. …`, `2. …`). No `<h3>`.
- **In short** — every article ends with it: the takeaways as imperative one-liners.
- **Contact panel** — closes the page. The `<h2>` is a question tied to the article's subject ("Planning an integration?"); the paragraph and the `mailto:` button are the standard ones, copied unchanged.
- Length: 900–1,000 words including code, which is about a five-minute read.

## Release overviews

An article about a Salesforce seasonal release (reference: `salesforce-winter-27-release.html`) is the one kind that departs from the shape above:

- **Topic** is `Releases`. **Audience** may name three groups — `For developers, admins and QA` — because the article is organised by them.
- **Length** is 1,500–2,000 words, and it may have more than seven `<h2>` sections.
- **Sections** run in this order: what changes without any action, then one or two sections per audience ("For developers: …", "For admins: …", "For QA: …"), then the dates of coming enforcements and retirements as a table, then "In short".
- **Every feature carries its status** in words — generally available, beta, developer preview, release update — and says where a beta is not available.
- **Sources.** Each statement has to be read in the official release notes on help.salesforce.com, not taken from blogs: community round-ups are useful for finding features and regularly get details wrong. If the official note for a claim cannot be found, the claim is left out. The intro links to the official release notes for that release. A code sample is included only when it appears in the official note or documentation.
- Release names and enforcement dates ("Spring '27", "1 December 2026") are content and are allowed; the article still has no publication date.
- When a release changes a fact stated in an older article (a limit, a setting name), update that article in the same change.

## `<head>`

Copy from an existing article and change only: `<title>`, `<meta name="description">`, `<link rel="canonical">`, `og:url`, `og:title`, `og:description`. `og:type` stays `article`, `og:image` stays `https://trailteam.dev/images/og.png`. Canonical and `og:url` are `https://trailteam.dev/articles/<slug>.html`.

## Voice

- English, British spelling, as on the landing page ("behaviour", "recognise").
- Address the reader as "you". Short declarative sentences; say what breaks and what to do instead. No hype, no filler openings, no "in today's fast-paced world".
- State facts about the platform precisely — exact limits, exact error messages, exact API names — and verify them against Salesforce documentation before writing them down.
- No invented projects, clients, numbers or "in our experience at…" anecdotes. The content rules in `CLAUDE.md` apply to articles too.
- Typography through entities: `&mdash;` with a space either side, `&ldquo;…&rdquo;` for quotes, `&middot;` in the meta line.

## Markup inside `.prose`

- **Code blocks** — `<pre><code>…</code></pre>`, starting at column 0 of the source file because the whitespace is rendered. Four-space indent inside. Escape `<`, `>` and `&` as entities. No syntax highlighter.
- Samples must be valid as written: no pseudo-code, no undefined helpers unless the body is an explanatory comment. Apex follows current practice — the `Assert` class, user-mode queries and DML, `with sharing`. A "wrong" example is always followed by the corrected one.
- **Inline code** — `<code>` for identifiers, annotations, API names and literal error messages.
- **Emphasis** — `<strong>` for the lead-in phrase of a list item or paragraph, or the one number that matters. `<em>` only for the exact label of a setting or option as it appears in Setup. Nothing else.
- **Tables** — for comparisons and limits: `<thead>` with `<th scope="col">`, plain `<td>` rows, no classes.
- **Lists** — `<ul>` for parallel points, with a `<strong>` lead-in when each item needs explaining.
- No images, no `<footer>` inside the article (the bare `footer` selector styles the site footer), no inline styles, no new CSS unless a genuinely new element is needed — then add it to `site.css` under the Articles block using tokens only.

## Before finishing

- New card is the first `<li>`; its meta line, title and summary match the article exactly.
- Reading time recounted.
- `sitemap.xml` updated.
- Page checked in the preview in dark and light themes and at phone width: no horizontal page scroll, code blocks scroll inside themselves.
