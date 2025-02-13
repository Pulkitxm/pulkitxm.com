ARG NODE_VERSION=23.6.1
ARG PORT=3000

FROM node:${NODE_VERSION}-alpine3.20 AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM node:${NODE_VERSION}-alpine3.20 AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:${NODE_VERSION}-alpine3.20 AS runner
ARG PORT
WORKDIR /app

RUN apk add --no-cache tini && \
    npm install -g pnpm && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy the entire .next directory instead of just standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256"

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["pnpm", "start"]