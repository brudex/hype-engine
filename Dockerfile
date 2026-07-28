FROM node:24.18.0-bookworm-slim AS dependencies

WORKDIR /app

RUN apt-get update \
    && apt-get install --yes --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:24.18.0-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/logs /app/public/uploads \
    && chown -R node:node /app

USER node

EXPOSE 3000 3001

CMD ["node", "./bin/www"]
