# Editing guide

How to change the content of honeye.me, add projects and photos, run the site locally and how deployment works.


## Pages

| URL | What it shows | Content comes from |
|---|---|---|
| `/` | Intro, career timeline, latest two projects | `src/data/profile.json`, `experience.json`, projects |
| `/projects/` | All projects, one per row (upcoming first, then newest) | `src/content/projects/*.md` |
| `/projects/<name>/` | One project: cover image, write-up, links | the matching `.md` file |
| `/experience/` | Professional experience in one chronological list, then education | `experience.json`, `education.json` |
| `/skills/` | Skills, tools, languages | `skills.json`, `education.json` |
| `/hobbies/` | Hobbies & interests with photo galleries | `hobbies.json`, `public/images/hobbies/` |

The sidebar (photo, navigation, light/dark toggle, contact links, "Made with ♥ …") is the same on every
page and reads from `profile.json`.

## Editing content (no coding needed)

| What | Where |
|---|---|
| Name, headline, tagline, intro paragraphs (`summary`, each with an optional `icon`), short `metaDescription` for search and social previews, location, links, availability, "Made with" line | `src/data/profile.json` |
| Work and additional experience (see below) | `src/data/experience.json` |
| Skills in three groups: `core`, `tools`, `learning` (entries may carry a `level` such as "Foundational knowledge") | `src/data/skills.json` |
| Education and languages | `src/data/education.json` |
| Hobbies: title, one-line description, photos with alt text | `src/data/hobbies.json` |
| Projects (one file each) | `src/content/projects/*.md` |
| Project cover images | `public/images/projects/` |
| Hobby photos | `public/images/hobbies/<hobby>/` |
| Portrait | `public/images/honeye-480.jpg` and `honeye-960.jpg` (square, same photo at two sizes) |

### Experience entries

Each entry in `experience.json` has an `icon` (shown in the circle next to the entry) and a `kind`:

- `hr` — a job; drawn in blue on the timeline (legend: "Role")
- `training` — a period of courses or self-study; orange on the timeline (legend: "Training")
- `other` — side projects or ventures; teal on the timeline (legend: "Project")

Entries are shown in the order they appear in the file. The timeline sorts by start date and its legend
only lists the kinds that are in use. An optional `short` field gives a shorter name for the timeline
when the heading (`company`) is long.

Dates are `"YYYY-MM"`, or just `"YYYY"` when only the year is known; `"to": null` means present. The
career timeline on the homepage is drawn from these dates, so fixing a date there updates the chart.
Durations are only shown when both dates include a month.

Available icon names (used by experience entries, hobbies and page headings): `users`, `globe`, `book`,
`code`, `palette`, `graduation`, `briefcase`, `chart`, `sparkles`, `heart`, `camera`, `pen`, `dice`,
`cookie`, `tools`, `star`, `home`, `mail`. New ones are added in `src/components/Icon.astro` as a
single SVG path.

### Hobby photos

Each hobby in `hobbies.json` has an `icon` and lists its photos with a full-size `src`, a `thumb`, an `alt` description
and the thumbnail's `w`/`h`. Photos live in `public/images/hobbies/<hobby>/` as `01.jpg` (full size,
longest side 1600 px) and `01-thumb.jpg` (longest side 800 px). Resize new photos before adding them;
camera originals are far too large for a web page. A hobby with one photo shows it at its natural
shape, two photos side by side, three or more as a mosaic with a large lead image. Clicking a photo opens it in an in-page
viewer with previous/next arrows; Escape, the close button, a tap outside or the browser back button
closes it.

### Other tips

- The sun/moon button in the sidebar switches between light and dark mode and remembers the choice
  in the visitor's browser. Without a choice the site follows the device setting.
- The email address is stored in two parts (`"user"` and `"domain"`) and only assembled in the
  visitor's browser, so it never appears as `name@domain` in the HTML or in this repository. This keeps
  it away from most address-harvesting bots.

### Adding a project

1. Copy `src/content/projects/_template.md` to a new file, e.g. `src/content/projects/attrition-analysis.md`.
   The file name becomes the URL: `/projects/attrition-analysis/`.
2. Fill in the fields at the top: title, summary, date, tools, the LinkedIn article and/or post links.
3. Add a cover image to `public/images/projects/` (landscape works best, about 1280 px wide) and
   set `image:` and `imageAlt:`.
4. Set `status: published` when it is ready, or leave `status: upcoming` to show a "Coming soon" card.
5. Write the full story below the `---` line in Markdown. Extra images can go in `public/images/`
   and be referenced as `![caption](/images/my-chart.png)`.
6. Commit and push to `main`. The deploy workflow rebuilds and publishes the site automatically.

## Running locally

Requires Node.js 24 (see `.nvmrc`).

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs the static site to dist/
npm run preview    # serve dist/ locally
```

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main`: it installs
dependencies, runs `npm run build` and then `wrangler deploy`, which uploads `dist/` to Cloudflare as
static assets (see `wrangler.jsonc`). Progress and logs are under the repository's **Actions** tab,
where the workflow can also be started by hand.

The workflow needs two repository secrets (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account that owns the worker.
- `CLOUDFLARE_API_TOKEN`: an API token with **Workers Scripts: Edit** on that account (the
  "Edit Cloudflare Workers" template in the Cloudflare dashboard provides this).

Manual deploy from a machine with Cloudflare access:

```sh
npx wrangler login
npm run deploy
```

The site is served at https://honeye.me, a custom domain declared under `routes` in `wrangler.jsonc`
(the DNS zone is on the same Cloudflare account). The worker's `*.workers.dev` address is switched off
(`workers_dev: false`) so there is a single public URL. If the public URL ever changes, update `site`
in `astro.config.mjs` so canonical and social-preview links stay correct.

## Pushing from a shared machine

Commits are authored as `Honeye Yekta <163159599+HoneyeYekta@users.noreply.github.com>` via the
repo-local git config. If the machine's GitHub CLI is logged into several accounts, switch before
pushing:

```sh
gh auth switch -u HoneyeYekta
git push
```

## Content still to review

- [ ] Project pages contain placeholder "Full write-up coming soon" text. Replace with the real analysis.
- [ ] The tagline, page intros and hobby descriptions are first drafts; adjust the wording to taste.
- [ ] Hobby photos were split between "Photo journaling" and "Baking" from one shared folder; move
  entries between hobbies in `hobbies.json` if the split feels wrong.
