# =========================
# 1. Base image
# =========================
FROM node:20-alpine AS base

WORKDIR /app

# pnpm cần corepack
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# =========================
# 2. Dependencies layer
# =========================
FROM base AS deps

# Copy đúng thứ tự để cache hiệu quả
COPY package.json pnpm-lock.yaml ./

# Prisma cần schema khi install
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

# =========================
# 3. Build layer
# =========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG SERVICE
RUN pnpm nest build ${SERVICE}

# =========================
# 4. Production runtime
# =========================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Chỉ copy những thứ cần thiết
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY package.json ./

ARG SERVICE
ENV SERVICE=${SERVICE}

CMD ["sh", "-c", "node dist/apps/$SERVICE/main.js"]
