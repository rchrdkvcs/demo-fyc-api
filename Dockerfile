# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS dependencies

WORKDIR /app
RUN npm install --global pnpm@11.7.0

# These files change less often than the application source, so dependency
# installation remains cached when a learner edits a controller.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build

COPY . .
RUN pnpm build

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3333

WORKDIR /app
RUN npm install --global pnpm@11.7.0

# AdonisJS emits a self-contained production directory with its own manifest.
COPY --from=build /app/build ./
RUN pnpm install --prod --frozen-lockfile \
    && chown -R node:node /app

USER node
EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3333/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "bin/server.js"]
