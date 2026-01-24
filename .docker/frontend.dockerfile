FROM oven/bun:canary-alpine AS base
WORKDIR /noteme/app

# <<< 1. install dependencies into temp directory, this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY frontend/package.json frontend/bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY frontend/package.json frontend/bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# <<< 2. build
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/prod/package.json package.json

ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_PROXY
ARG VITE_AUTOSAVE_DELAY
ARG VITE_RECENT_TIME_UPDATE_AT
ARG VITE_TRANSITION_DURATION

ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY} \
    VITE_API_PROXY=${VITE_API_PROXY} \
    VITE_AUTOSAVE_DELAY=${VITE_AUTOSAVE_DELAY} \
    VITE_RECENT_TIME_UPDATE_AT=${VITE_RECENT_TIME_UPDATE_AT} \
    VITE_TRANSITION_DURATION=${VITE_TRANSITION_DURATION}

COPY frontend/ .
RUN bun run build

# <<< 3. copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /noteme/app/dist ./dist
COPY --from=prerelease /noteme/app/package.json .

# <<< 4. run the app
USER bun
EXPOSE 5173/tcp
ENTRYPOINT ["bun", "x", "serve", "./dist", "-p", "5173"]
