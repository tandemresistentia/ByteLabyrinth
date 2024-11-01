# Build stage
FROM node:18 as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy project files
COPY . .

# Build the app
RUN ng build --configuration production

# Serve stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]