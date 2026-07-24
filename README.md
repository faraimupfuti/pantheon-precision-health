# Pantheon Precision Health

AI-assisted skin condition screening. Upload or capture a photo, get ranked
predictions from a Roboflow classification workflow, and download a clinical
reference PDF report with treatment recommendations.

## Stack

- Next.js 14 (App Router, TypeScript, Tailwind)
- Roboflow serverless workflow for inference (called server-side only — the
  API key never reaches the browser)
- `@react-pdf/renderer` for PDF report generation
- `react-webcam` for in-browser camera capture

## Covered conditions

Melanoma, Basal Cell Carcinoma, Actinic Keratosis, Xeroderma Pigmentosum,
Rosacea, Scabies, Seborrheic Dermatitis, Tinea Corporis, Urticaria, Urticaria
Pigmentosa, Vitiligo, Xanthomas, Acne, Acne Vulgaris, Allergic Contact
Dermatitis, Atopic Dermatitis, Contact Dermatitis, Eczema, Folliculitis,
Keloid. Reference content lives in `lib/diseases.ts` — edit it to correct or
expand clinical copy.

## Local development

```bash
npm install
cp .env.example .env.local
# edit .env.local and set ROBOFLOW_API_KEY
npm run dev
```

Visit `http://localhost:3000`.

## How image analysis works

The browser never talks to Roboflow directly. The `/scan` page uploads the
photo to `POST /api/analyze`, a Next.js server route that:

1. Reads the uploaded file and base64-encodes it
2. Calls your Roboflow workflow with `{ type: "base64", value: ... }`
3. Parses the response (robust to a few common Roboflow output shapes) and
   matches the top labels against the local disease reference

If your specific workflow only accepts `type: "url"` inputs rather than
base64, use the `analyzeImageUrl()` helper already included in
`lib/roboflow.ts` — you'll need to host the uploaded image somewhere
(e.g. S3, Cloudinary, Vercel Blob) first and pass that public URL in.

`POST /api/report` takes a disease id + confidence + optional image and
streams back a generated PDF using `@react-pdf/renderer` — no headless
browser required, so it runs fine on small dynos/instances.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ROBOFLOW_API_KEY` | Yes | Your Roboflow API key. Set as a secret on every platform — never commit it. |
| `ROBOFLOW_WORKFLOW_URL` | No | Defaults to the workflow URL already wired in. Override only if you point at a different workflow. |

> **Security note:** if the API key you're using was ever pasted into a chat,
> ticket, or shared doc, treat it as compromised and rotate it in your
> Roboflow dashboard before going live.

## Deploying from GitHub

Push this project to a GitHub repository first — all three platforms below
deploy straight from it.

### Render

1. New → Blueprint, point at your repo (this project includes `render.yaml`).
2. Render will build the included `Dockerfile` automatically.
3. In the service's Environment tab, set `ROBOFLOW_API_KEY`.
4. Every push to your default branch redeploys automatically.

### Fly.io

```bash
fly launch --no-deploy   # detects fly.toml, keep existing settings
fly secrets set ROBOFLOW_API_KEY=your_key_here
fly deploy
```

To auto-deploy from GitHub, add Fly's official GitHub Action
(`fly deploy` on push) or connect the repo under **Fly dashboard → your
app → GitHub integration**.

### Heroku

Heroku can build either from the Dockerfile (container stack, included as
`heroku.yml`) or from the Node buildpack (using the included `Procfile`).

**Container stack (recommended, matches the Dockerfile everywhere else):**

```bash
heroku create pantheon-precision-health
heroku stack:set container
heroku config:set ROBOFLOW_API_KEY=your_key_here
git push heroku main
```

**Or connect via the Heroku dashboard:** *Deploy tab → GitHub → connect
repo → enable automatic deploys*, then set `ROBOFLOW_API_KEY` under
*Settings → Config Vars*.

## Notes on the model output parser

Roboflow workflow response shapes vary depending on how the workflow's
output blocks are configured. `extractPredictions()` in `lib/roboflow.ts`
handles the common shapes (`predictions: [...]`, `{ top, confidence }`,
keyed prediction maps) and falls back to a resilient recursive search. If
your workflow returns something it doesn't catch, log `result.raw` from
`/api/analyze` and adjust `extractPredictions()` — it's a single, isolated
function.

## Disclaimer

This tool provides an automated, informational screening only. It is not a
diagnostic device and does not replace evaluation by a licensed
dermatologist or physician. The disclaimer is surfaced in the UI and in
every generated PDF report — keep it there if you customize the design.
