FROM node:20 as development

WORKDIR /usr/src/app

COPY ./api/package*.json ./

RUN npm install

COPY /api .

EXPOSE 8085

RUN npm i @packages/http-server @packages/ioc @packages/logger
RUN npm run models:generate
RUN npm run build
CMD ["npm", "run", "start"]

FROM development as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm ci --production

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY ./bin/setup-db.sh .

CMD ["node", "dist/main.js"]



