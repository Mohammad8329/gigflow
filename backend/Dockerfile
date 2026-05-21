# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the backend port
EXPOSE 5000

# Start the compiled server 
# (Make sure your package.json has a "start": "node dist/server.js" script)
CMD ["npm", "start"]