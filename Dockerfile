# syntax=docker/dockerfile:1
# cf. https://pnpm.io/docker
FROM node:24.10.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app
# Gitとssh関連ツールをインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        openssh-client \
    && rm -rf /var/lib/apt/lists/*

# === 依存関係ステージ ===
FROM base AS deps
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# === 開発ステージ ===
FROM base AS dev
ENV NODE_ENV=development
COPY bin/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "dev"]
