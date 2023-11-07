FROM node:16.12-alpine as development

WORKDIR /usr/src/app

COPY ./api/package*.json ./

RUN npm install

COPY ./api .

EXPOSE 8085

RUN npm i @packages/http-server @packages/ioc @packages/logger
RUN npm run models:generate
RUN npm run build
#CMD ["npm", "run", "build"]

FROM development as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm ci --production

COPY --from=development /usr/src/app/dist ./dist
COPY ./bin/setup-db.sh .

RUN chmod +x setup-db.sh
RUN echo "hello"
RUN ls
CMD ["node", "dist/main.js"]
#FROM development as production
#
#WORKDIR /usr/src/app
#
#COPY ./api/package*.json ./
#
#RUN npm i
#
#COPY ./api .
#COPY ./bin/setup-db.sh .
#
#EXPOSE 8085
#
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#
#RUN npm i @packages/http-server @packages/ioc @packages/logger
#RUN npm run models:generate
#RUN npm run build
#
#CMD ["node", "dist/main.js"]



