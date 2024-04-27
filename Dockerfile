FROM oven/bun

COPY package.json bun.lockb ./
RUN --mount=type=cache,id=s/72fb87a0-f60d-4204-b5ca-bdfb0dcc1d96-/root/bun,target=/root/.bun bun install

COPY . ./
RUN bun run build

CMD [ "bun", "start" ]
