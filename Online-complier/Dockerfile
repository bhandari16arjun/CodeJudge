FROM node:20

RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    time \
    bash \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG MODE=production
ENV NODE_ENV=$MODE

EXPOSE 3000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else node server.js; fi"]
