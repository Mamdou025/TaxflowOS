# Deploying TaxflowOS (Replit + Docker)

TaxflowOS is a Next.js 16 app (pnpm, Node 22). It **boots without a database** —
every DB call fails soft, so you can ship a working chat deploy with just an AI
key and wire Supabase in later. See [persistence-setup.md](./persistence-setup.md).

---

## Environment variables

Set these as **Replit Secrets** (Deploy → Secrets) or via `--env-file` for Docker.
Never commit them — `.env.local` is gitignored on purpose.

### Minimum to run (chat works)

| Variable            | Notes                                                                 |
|---------------------|-----------------------------------------------------------------------|
| `OPENAI_API_KEY`    | Powers the assistant. Or use `AI_GATEWAY_API_KEY` instead/as well.    |
| `AI_GATEWAY_API_KEY`| Vercel AI Gateway key — unlocks any `provider/model` id.             |
| `OPENAI_CHAT_MODEL` | Chat model id (e.g. `gpt-4o`). Optional; has a default.              |

### Recommended for a real deployment

| Variable              | Notes                                                                    |
|-----------------------|--------------------------------------------------------------------------|
| `BETTER_AUTH_SECRET`  | Signing secret for sessions. Set a long random value in production.      |
| `BETTER_AUTH_URL`     | Public URL of the deploy, e.g. `https://<your-repl>.replit.app`.        |
| `NEXT_PUBLIC_APP_URL` | Same public URL; used client-side and as an auth fallback.              |

### Optional (features degrade gracefully if unset)

| Variable                             | Enables                                              |
|--------------------------------------|-----------------------------------------------------|
| `DATABASE_URL` / `DIRECT_URL`        | Saved chats + persistence (Supabase pooler / direct)|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Document storage + RAG                       |
| `FIRECRAWL_API_KEY`                  | Live web-scraping tools                             |
| `GITHUB_CLIENT_ID` / `GOOGLE_CLIENT_ID` (+ secrets) | OAuth sign-in                        |
| `RESEND_API_KEY`, `SLACK_API_KEY`, `LINEAR_API_KEY` | Corresponding workflow integrations  |

> `SUPABASE_SERVICE_ROLE_KEY` is server-only — never expose it to the client.

---

## Path A — Replit native (fastest)

Replit reads [`.replit`](../.replit); it does **not** use the Dockerfile.

1. Import the repo into Replit (or push and connect the Git repo).
2. **Deploy** → choose **Autoscale** (matches `deploymentTarget = "cloudrun"`;
   scales to zero, pay-per-use). For an always-on box pick **Reserved VM** instead.
3. Add the Secrets from the tables above.
4. Deploy. The build runs `pnpm install && pnpm build`; the app serves on port
   3000, exposed publicly on 443.

Nothing else to configure — `next start` binds `0.0.0.0:3000` and Replit maps it.

---

## Path B — Docker (portable / reproducible)

Use this for Cloud Run (directly), Railway, Render, Fly.io, or a VPS — anywhere
that runs containers. Replit's native deploy ignores it.

```bash
docker build -t taxflowos .
docker run --rm -p 3000:3000 --env-file .env.local taxflowos
# open http://localhost:3000
```

- The image builds Linux-native `node_modules` inside the container, so it works
  even though the repo was checked out on Windows.
- Secrets are passed at runtime (`--env-file` / `-e`), never baked into the image.
- Image-size optimization (Next `output: 'standalone'`, prod-only prune) is a
  possible follow-up; the current image prioritizes "just works".

---

## Database migrations

The build **skips** migrations (`scripts/migrate-prod.ts` only runs them when
`VERCEL_ENV=production`, which isn't set on Replit/Docker). If you provision
Supabase, run migrations once against the **direct** connection:

```bash
# locally, with DIRECT_URL set to the Supabase direct (port 5432) URL
pnpm db:migrate
```

Then enable the `vector` extension and create the `company-documents` storage
bucket — details in [persistence-setup.md](./persistence-setup.md).
