# Honeye Yekta — portfolio

Personal site for Honeye Yekta (HR data & People Analytics). Built with [Astro](https://astro.build),
hosted on Cloudflare Workers (static assets). No JavaScript is shipped to visitors; all content lives
in small data files so it can be edited without touching the layout.

## Editing content (no coding needed)

| What | Where |
|---|---|
| Name, headline, summary, location, links, availability line, highlight tiles | `src/data/profile.json` |
| Work experience | `src/data/experience.json` |
| Skills and tools (with optional level like "Developing") | `src/data/skills.json` |
| Education, professional development, languages | `src/data/education.json` |
| Projects (one file each) | `src/content/projects/*.md` |
| Photo | `public/images/honeye-480.jpg` and `honeye-960.jpg` (square, same photo at two sizes) |

Tips:

- In `profile.json`, the highlight value `"{projects}"` is replaced automatically with the number of
  published projects. Any other value is shown as written.
- Set `"availability": ""` to hide the availability line in the Contact section.

### Adding a project

1. Copy `src/content/projects/_template.md` to a new file, e.g. `src/content/projects/attrition-analysis.md`.
   The file name becomes the URL: `/projects/attrition-analysis/`.
2. Fill in the fields at the top (title, summary, date, tools, LinkedIn link).
3. Set `status: published` when it is ready, or leave `status: upcoming` to show a "Coming soon" card.
4. Write the full story below the `---` line in Markdown. Images can go in `public/images/` and be
   referenced as `![caption](/images/my-chart.png)`.
5. Commit and push to `main`. Cloudflare rebuilds and publishes the site automatically.

## Running locally

Requires Node.js 24 (see `.nvmrc`).

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs the static site to dist/
npm run preview    # serve dist/ locally
```

## Deployment

The site is deployed by Cloudflare's Git integration: every push to `main` runs `npm run build` and
then `npx wrangler deploy`, which uploads `dist/` as static assets (see `wrangler.jsonc`).

Manual deploy from a machine with Cloudflare access:

```sh
npx wrangler login
npm run deploy
```

After the first deploy, update `site` in `astro.config.mjs` with the real URL so canonical and
social-preview links are correct. To attach a custom domain later, add a `routes` entry in
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
- [ ] Highlight tiles in `profile.json` are taken from the CV; adjust wording or numbers as you like.
- [ ] `site` in `astro.config.mjs` after the first Cloudflare deploy.
