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

# Build SSR application
RUN npm run build

# Expose port
EXPOSE 4000

# The start command will come from railway.toml
CMD ["npm", "start"]