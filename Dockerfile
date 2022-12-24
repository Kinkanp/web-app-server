FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8080

RUN npm i @packages/http-server @packages/ioc
RUN npm run build

CMD ["node", "dist/main.js"]
