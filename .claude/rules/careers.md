# Careers (vacancies)

Rules for everything under `careers/`. The two existing vacancies (`salesforce-developer-latam.html`, `salesforce-developer-poland.html`) are the reference implementation — start a new one from a copy.

## What must come from the team

A vacancy is a statement about the company, so its facts are never invented. Before writing one, the team has to supply: the role, the level, the location, the employment type, the work format (remote, office or hybrid) and whether the position is open or closed. If any of these is missing, ask.

Never add salary, benefits, contract type, working hours, number of openings, team size or a hiring timeline unless the team gave them. A vacancy without those lines is complete; one with made-up values is not.

## Files to touch when adding a vacancy

1. `careers/<slug>.html` — the vacancy. Flat file, lowercase kebab-case: role, then location (`salesforce-developer-poland`). No dates or numbers in the slug.
2. `careers/index.html` — a new card (see order below) and, if the number of open positions changed, the lede sentence under the `<h1>`.
3. `sitemap.xml` — a new `<url>` with the canonical address and today's `<lastmod>`.

## Order on the listing page

Open positions come first, closed ones after them. **A new vacancy is added as the first `<li>` in `<ul class="article-list">`** (the list class is shared with the articles listing). When a vacancy closes, its card moves below the last open one; cards are otherwise never reordered. A closed vacancy stays on the site, marked as closed, until the team asks for it to be removed.

The lede under the `<h1>` says how things stand in one plain sentence — "There are no open positions at the moment. The roles below have been filled." when everything is closed — and has to be rewritten whenever a vacancy opens or closes.

Directly under the lede sits a standing invitation: Salesforce specialists may send a CV to `careers@trailteam.dev`, and TrailTeam will let them know when a position opens. It stays in place and unchanged whether or not anything is open. `careers@trailteam.dev` is the address for everything a candidate sends; `contactus@trailteam.dev` is for customers and is not used in vacancy copy (it remains in the shared footer).

## No publication dates

Vacancies carry no posting date, no closing date and no `<time>` element. The only date anywhere is `<lastmod>` in `sitemap.xml`.

## Status

Every vacancy shows its status in three places, and all three must agree:

- the pill at the start of the meta line, on the card and on the vacancy page;
- the notice under the lede of the vacancy page (closed vacancies only);
- the Status row of the Details table.

Closed:

```html
<p class="meta"><span class="status status-closed">Closed</span>Middle/Senior &middot; Full-time &middot; Remote</p>
```

The pill says just `Closed` — one word, no reason attached. `status-closed` makes it soft red (the `--closed` / `--closed-bg` tokens) so a visitor sees at a glance that the role is gone; never leave a closed pill in the neutral base style. The explanation belongs to the notice:

```html
<p class="notice">
    <strong>This position is closed.</strong> We have found the people for this role and
    are no longer accepting applications for it.
</p>
```

Open:

```html
<p class="meta"><span class="status status-open">Open</span>Middle/Senior &middot; Full-time &middot; Remote</p>
```

An open vacancy has no notice. A closed vacancy also carries ` (closed)` after the title in `<title>` and `og:title`, and "This position has been filled." at the end of both descriptions; remove or add these when the status changes.

## The meta line

After the status pill: **level**, **employment type**, **work format**, separated by `&middot;` — `Middle/Senior &middot; Full-time &middot; Remote`. Levels are written `Junior`, `Middle`, `Senior` or a pair joined with a slash. Work format is `Remote`, `Office` or `Hybrid`. Location is not repeated here; it is in the title.

The work format appears in three more places that have to agree with the meta line: the last sentence of "About the role" ("This is a remote position."), the Work format row of the Details table, and both descriptions in `<head>`.

## Page structure

```
<main class="reading">
    <a class="back" href="./">&larr; All positions</a>

    <article class="prose">
        <p class="meta">status pill + level · employment · work format</p>
        <h1>Role, Location</h1>
        <p class="lede">One sentence on what the work is.</p>
        <div class="rule"></div>

        <p class="notice">…</p>            closed vacancies only

        <h2>About the role</h2>            one paragraph
        <h2>What you will do</h2>          <ul>, 6–8 items
        <h2>What we are looking for</h2>   <ul>, 7–9 items
        <h2>Nice to have</h2>              <ul>, 3–5 items
        <h2>Details</h2>                   <table>: Location, Employment, Work format, Level, Status
    </article>

    <section class="panel contact"> … </section>   open vacancies only
</main>
```

- **Title** — role and location separated by a comma: "Salesforce Developer, Poland". The level stays out of the title. Used unchanged in `<h1>` and on the card; `<title>` appends ` | TrailTeam`.
- **Lede** — one sentence describing the work, identical on the card. Two vacancies for the same role in different locations share the same lede and the same description; only the location differs.
- **Description** — a standard one for the role, with no project-, client- or location-specific detail unless the team supplied it. Each list item is one line, starts with a verb ("What you will do") or a noun phrase ("What we are looking for") and ends with a full stop. Requirements must be things a candidate can check against themselves: years of experience, named technologies, a named certification, a language level.
- **Details** — a two-column table with `<th scope="row">` labels. Add a row only for a fact the team supplied.
- **Apply panel** — open vacancies end with the site's standard contact panel: an `<h2>` such as "Interested in this role?", one sentence asking for a CV, and a `mailto:careers@trailteam.dev` button. Closed vacancies have no apply panel and no invitation to apply for that role; the general invitation lives on the listing page only.

## `<head>`

Copy from an existing vacancy and change only: `<title>`, `<meta name="description">`, `<link rel="canonical">`, `og:url`, `og:title`, `og:description`. `og:type` stays `website`. The description names level, role, location, employment type and work format. In the main menu, Careers carries `aria-current="true"` on a vacancy page and `aria-current="page"` on the listing.

## Voice and markup

- English, British spelling, plain and factual. "We" for TrailTeam, "you" for the candidate. No superlatives ("rockstar", "world-class", "exciting opportunity").
- Statements about TrailTeam have to be true today and consistent with `CLAUDE.md`: do not mention clients, projects delivered or team size.
- Markup is limited to what `.prose` already styles — `<h2>`, `<p>`, `<ul>`, `<table>`, `<strong>` — plus `.status` and `.notice`. No images, no `<footer>` inside the article, no inline styles.

## Before finishing

- Card position follows the order rule; its status pill, meta line, title and lede match the vacancy page exactly.
- Status agrees in the pill, the notice, the Details table, `<title>` and the descriptions.
- The lede on `careers/index.html` matches the real number of open positions.
- `sitemap.xml` updated.
- Page checked in the preview in dark and light themes and at phone width.
