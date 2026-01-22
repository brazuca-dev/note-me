FROM oven/bun:1 AS base
WORKDIR /noteme/api

# <<< 1. install dependencies into temp directory, this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY backend/package.json backend/bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY backend/package.json backend/bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# <<< 2. tests & build
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun test
RUN bun run build

# <<< 3. copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /noteme/api/dist/index.ts .
COPY --from=prerelease /noteme/api/package.json .

# <<< 4. run the api
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]