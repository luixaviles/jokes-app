FROM node:20-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN NX_REJECT_UNKNOWN_LOCAL_CACHE=0 npx nx build server
FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g pm2@latest
RUN npm install --only=production --silent
COPY --from=builder /usr/src/app/dist/apps/server ./build
EXPOSE 3000
ENTRYPOINT ["pm2-runtime","build/main.js"]