FROM oven/bun

COPY package.json bun.lockb ./
RUN --mount=type=cache,id=s/${RAILWAY_SERVICE_ID}-/root/bun,target=/root/.bun bun install

COPY . ./
RUN bun run build

CMD [ "bun", "start" ]
