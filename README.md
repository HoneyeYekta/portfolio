# Honeye Yekta — portfolio

Personal site for Honeye Yekta (HR data & People Analytics). Built with [Astro](https://astro.build),
hosted on Cloudflare Workers (static assets). All content lives in small data files so it can be
edited without touching the layout.

## Pages

| URL | What it shows | Content comes from |
|---|---|---|
| `/` | Intro, career timeline, latest two projects | `src/data/profile.json`, `experience.json`, `education.json`, projects |
| `/projects/` | All projects (upcoming first, then newest) | `src/content/projects/*.md` |
| `/projects/<name>/` | One project: featured image, write-up, links | the matching `.md` file |
| `/experience/` | Work history, education, professional development | `experience.json`, `education.json` |
| `/skills/` | Skills, tools, languages | `skills.json`, `education.json` |

The sidebar (photo, navigation, contact links, "Made with ♥ …") is the same on every page and reads
from `profile.json`.

## Editing content (no coding needed)

| What | Where |
|---|---|
| Name, headline, tagline, summary, location, links, availability, "Made with" line | `src/data/profile.json` |
| Work experience (dates as `YYYY-MM`, `"to": null` means present) | `src/data/experience.json` |
| Skills and tools (with optional level like "Developing") | `src/data/skills.json` |
| Education, professional development, languages | `src/data/education.json` |
| Projects (one file each) | `src/content/projects/*.md` |
| Project images | `public/images/projects/` |
| Portrait | `public/images/honeye-480.jpg` and `honeye-960.jpg` (square, same photo at two sizes) |

Tips:

- The sun/moon button in the sidebar switches between light and dark mode and remembers the choice
  in the visitor's browser. Without a choice the site follows the device setting.
- The career timeline on the homepage is drawn from the role dates in `experience.json` and the
  training dates in `education.json`. Fix a date there and the chart updates.
- The email address is stored in two parts (`"user"` and `"domain"`) and only assembled in the
  visitor's browser, so it never appears as `name@domain` in the HTML or in this repository. This keeps
  it away from most address-harvesting bots.

### Adding a project

1. Copy `src/content/projects/_template.md` to a new file, e.g. `src/content/projects/attrition-analysis.md`.
   The file name becomes the URL: `/projects/attrition-analysis/`.
2. Fill in the fields at the top: title, summary, date, tools, the LinkedIn article and/or post links.
3. Add a featured image to `public/images/projects/` (landscape works best, about 1280 px wide) and
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
- `CLOUDFLARE_API_TOKEN`: an API token created in the Cloudflare dashboard (My Profile → API Tokens →
  Create Token → "Edit Cloudflare Workers" template).

Manual deploy from a machine with Cloudflare access:

```sh
npx wrangler login
npm run deploy
```

The site currently lives at https://portfolio.1saeedsalehi.workers.dev. If the URL ever changes
(for example a custom domain), update `site` in `astro.config.mjs` so canonical and social-preview
links stay correct. To attach a custom domain later, add a `routes` entry in
`wrangler.jsonc` (example in the file) and add the domain in the Cloudflare dashboard.

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
- [ ] The tagline and page intros are placeholders; adjust the wording to taste.
