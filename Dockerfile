
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
# =======
# # base image
# FROM node:lts

# # create & set working directory
# RUN mkdir -p /usr/src
# WORKDIR /usr/src

# # copy source files
# COPY . /usr/src

# COPY package*.json ./
# COPY prisma ./prisma/

# RUN apt-get -qy update && apt-get -qy install openssl

# # install dependencies
# RUN npm install

# RUN npm install @prisma/client

# COPY . .
# RUN npx prisma generate --schema ./prisma/schema.prisma
# # start app
# RUN npm run build
# EXPOSE 3000
# CMD npm run start
# >>>>>>> 7d7694b675201f07d22c45cc44871e97939afcd3
