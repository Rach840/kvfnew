# Use the official Node.js image
FROM node:16 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the project
RUN npm run build

# Use Nginx to serve static files
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]