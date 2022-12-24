FROM node:16.12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production

COPY . .

EXPOSE 8085

RUN npm i @packages/http-server @packages/ioc
RUN npm run models:generate
RUN npm run build

CMD ["node", "dist/main.js"]
