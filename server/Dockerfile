# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install dependencies (only production)
RUN npm install --production

# Copy source code
COPY . .

# Create uploads directory (ensure it exists)
RUN mkdir -p uploads

# Expose the port your app runs on
EXPOSE 10000

# Run as non-root user
USER node

# Start the app
CMD ["node", "index.js"]
