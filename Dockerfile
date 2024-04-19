FROM oven/bun:latest as bun

WORKDIR /usr/src/app

FROM bun as install
RUN mkdir -p /temp/prod

COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

USER bun
COPY --chown=bun . /usr/src/app

FROM install as build
CMD ["bun", "start"]