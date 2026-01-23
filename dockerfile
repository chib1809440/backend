FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN pnpm prisma generate

COPY . .

ARG SERVICE
RUN pnpm nest build ${SERVICE}

ENV SERVICE=${SERVICE}

CMD ["sh", "-c", "node dist/apps/$SERVICE/main.js"]
