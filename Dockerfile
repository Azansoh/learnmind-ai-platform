FROM node:22-alpine

WORKDIR /app

COPY server/package.json ./server/
RUN cd server && npm install

COPY client/package.json ./client/
RUN cd client && npm install

COPY server/ ./server/
COPY client/ ./client/

RUN cd client && npm run build

RUN ls -la /app/client/dist/

EXPOSE 5000

CMD ["node", "server/server.js"]
