FROM node:22-alpine

WORKDIR /app

COPY . .

RUN cd server && npm install

RUN cd client && npm install && npm run build

EXPOSE 5000

CMD ["node", "server/server.js"]
