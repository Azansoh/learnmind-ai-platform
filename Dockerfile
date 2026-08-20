FROM node:22-alpine

WORKDIR /app

COPY server/package.json ./server/
RUN cd server && npm install

COPY client/package.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

COPY server/ ./server/
RUN cp -r /app/client/dist /app/server/public

EXPOSE 5000

CMD ["node", "server/server.js"]
