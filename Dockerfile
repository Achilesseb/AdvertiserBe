FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["node", "dist/index.mjs"]