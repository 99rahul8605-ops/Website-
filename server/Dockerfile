# Use official Node.js LTS image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory (ensure it exists)
RUN mkdir -p uploads

# Final stage
FROM node:18-alpine
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app /app

# Expose the port your app runs on
EXPOSE 10000

# Run as non-root user
USER node

# Start the app
CMD ["node", "index.js"]
