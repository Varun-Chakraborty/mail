FROM node:iron-trixie-slim AS builder

ARG PG_USER
ARG PG_PASSWORD
ARG PG_DB

WORKDIR '/app'
COPY package*.json ./
COPY src src
COPY tests tests
COPY prisma prisma
COPY tsconfig.json .
RUN npm run build

# production stage
FROM node:alpine AS production
WORKDIR '/app'
COPY package*.json .
COPY --from=builder /app/dist/src dist/src
COPY --from=builder /app/prisma prisma
RUN npm ci --only=production && npx prisma generate
COPY module-alias.js ./
