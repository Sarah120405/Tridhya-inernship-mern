# Use a lightweight Node.js base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first for better build caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the application source code
COPY . .

# Ensure runtime directories exist
RUN mkdir -p /app/logs /app/uploads

# Set production environment
ENV NODE_ENV=production

# Document the port used by the application
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]