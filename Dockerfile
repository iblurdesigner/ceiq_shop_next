FROM node:16-alpine

WORKDIR /app

COPY ./ ./
RUN npm install --legacy-peer-deps
RUN npm run build

COPY next.config.js ./next.config.js


CMD [ "npm","run", "dev" ]