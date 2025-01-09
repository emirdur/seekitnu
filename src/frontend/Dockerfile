# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json tsconfig.json ./

# Copy specific directories
COPY ./src/frontend src/frontend
COPY ./src/shared src/shared

# Install dependencies
RUN npm install

# Expose the Vite development server port
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev:frontend"]
