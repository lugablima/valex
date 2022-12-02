FROM node
WORKDIR /usr/src/valex
COPY . .
EXPOSE 5000
RUN npm install && npm run build