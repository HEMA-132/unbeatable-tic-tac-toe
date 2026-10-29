# Build the existing React/Vite application without changing its source.
FROM node:22-alpine AS build
WORKDIR /app

COPY tic-tac-toe-app/package.json tic-tac-toe-app/package-lock.json ./
RUN npm ci

COPY tic-tac-toe-app/ ./
RUN npm test && npm run build

# Serve the generated static site. The game source and UI are unchanged.
FROM nginx:1.28-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
