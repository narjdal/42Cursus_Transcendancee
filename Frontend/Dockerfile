FROM node:14-alpine
RUN mkdir -p /svr/app
WORKDIR /svr/app
RUN npm i --silent
COPY package.json .
COPY package-lock.json .
RUN npm install --silent
COPY . .
EXPOSE $FRONTEND_PORT
CMD ["npm", "run", "start:debug"]