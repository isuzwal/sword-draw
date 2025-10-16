FROM node:20-alpine

RUN npm  install -g pnpm 

WORKDIR  /app

COPY  package.json   pnpm-lock.yaml pnpm-workspace.yaml    ./ 
COPY packages ./packages
COPY turbo.json ./
COPY apps/ws-backend ./apps/ws-backend

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/db exec prisma generate

RUN pnpm --filter @repo/backend-common build
RUN pnpm --filter ws-backend  build

EXPOSE 8080

CMD [ "node" , "apps/ws-backend/dist/index.js" ]
