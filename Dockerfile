FROM node:12-alpine
WORKDIR /usr/src/app
# Install  dependencies
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
#COPY .env.example .env
# Add port
EXPOSE 3000
CMD [ "npm","start", "server.js" ]
