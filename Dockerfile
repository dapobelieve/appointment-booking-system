FROM node:18-alpine as builder

WORKDIR /usr/src/app

RUN apk add --no-cache bash make gcc g++ python3

COPY package*.json ./

RUN npm install

RUN npm rebuild bcrypt

RUN apk del make gcc g++ python3

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/scripts/start.sh ./start.sh

RUN chmod +x ./start.sh

RUN npm install --production

EXPOSE 3030

ENTRYPOINT ["./start.sh"]
