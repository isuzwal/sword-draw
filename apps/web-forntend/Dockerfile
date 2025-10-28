FROM  node:20-alpine

RUN npm install -g pnpm

WORKDIR  /app

COPY  package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/web-forntend ./apps/web-forntend
COPY turbo.json ./


RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/backend-common build
RUN pnpm --filter @repo/db build
RUN pnpm --filter @repo/common build

RUN pnpm --filter web-forntend build
EXPOSE 3000

CMD ["pnpm", "--filter", "web-forntend", "start"]
