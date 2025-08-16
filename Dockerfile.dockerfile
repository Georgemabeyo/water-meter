FROM node:20-alpine

WORKDIR /app

# Copy package.json tu (na lock file kama ipo)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.js"]