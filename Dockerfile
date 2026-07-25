# syntax=docker/dockerfile:1
# Portable production image for TaxflowOS (Next.js 16 + pnpm).
#
# Replit's *native* deployment uses .replit (Nix) and does NOT read this file.
# This Dockerfile is for any container host — Google Cloud Run (directly),
# Railway, Render, Fly.io, a VPS — and for reproducible local runs.
#
#   docker build -t taxflowos .
#   docker run --rm -p 3000:3000 --env-file .env.local taxflowos
#
# Secrets are passed at runtime (--env-file / -e), never baked into the image.

# ── Stage 1: install deps + build ─────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# pnpm via corepack (bundled with Node 22).
RUN corepack enable

# Install dependencies first for better layer caching.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the source and build. `pnpm build` runs discover-plugins (regenerates the
# gitignored lib/*-registry.ts files) then `next build`. migrate-prod is skipped
# because VERCEL_ENV is unset here — run migrations separately (see docs).
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy the built app. node_modules and .next/ are excluded from the host by
# .dockerignore, so what we copy here is the Linux build produced in stage 1.
COPY --from=builder /app ./

EXPOSE 3000

# next start reads PORT + HOSTNAME from the env above; -H makes the bind explicit.
CMD ["npx", "next", "start", "-H", "0.0.0.0"]
