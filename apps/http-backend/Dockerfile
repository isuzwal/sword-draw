FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR  /app

COPY  package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/http-backend ./apps/http-backend
COPY turbo.json ./

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/db exec prisma generate

RUN pnpm --filter @repo/backend-common build
RUN pnpm --filter @repo/db build
RUN pnpm --filter @repo/common build
RUN pnpm --filter http-backend build

EXPOSE  8000

CMD [ "node" , "apps/http-backend/dist/index.js" ]

