FROM node:12

WORKDIR /usr/app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./.env .
RUN npm ci

COPY ./src/ ./src

CMD ["node", "src/index.js"]
