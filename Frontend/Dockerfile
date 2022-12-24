# FROM node:14.16.1

# WORKDIR /app

# COPY package.json ./ 

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]`

# FROM node:16.10.0-alpine3.14

# RUN addgroup app && adduser -S -G app app

# USER app

# WORKDIR /app

# COPY --chown=app:node package*.json ./

# RUN npm install

# COPY --chown=app:node . .

# EXPOSE 3000

# CMD [“npm”, “start”]

###Using default user i.e. node###

FROM node:18

# RUN addgroup app && adduser -S -G app app

# USER app

WORKDIR /app

COPY  . ./
# # COPY  package*.json ./
# COPY package-lock.json  ./
# COPY package.json ./

RUN npm install


EXPOSE 3000

CMD ["npm", "start"]
# CMD ["npm --prefix ./app/", "run", "start"]
# CMD ["sleep", "infinity"]