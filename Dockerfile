# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build frontend if needed (optional)
# RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
