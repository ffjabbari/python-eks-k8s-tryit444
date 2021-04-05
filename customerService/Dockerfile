FROM node:14-alpine AS NODE_BUILD
MAINTAINER Max Kornyev
COPY . /app/
WORKDIR /app
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
