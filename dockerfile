FROM node:20-alpine

WORKDIR /app

RUN pnpm prisma:generate
COPY prisma ./prisma

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

RUN npm install -g pnpm


COPY . .

ARG SERVICE
RUN pnpm nest build ${SERVICE}

ENV SERVICE=${SERVICE}

CMD ["sh", "-c", "node dist/apps/$SERVICE/main.js"]
