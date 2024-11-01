# Use Node.js as base
FROM node:18

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

# Build SSR application with production configuration
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]