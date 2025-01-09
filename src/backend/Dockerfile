# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json tsconfig.json ./

# Copy backend and shared workspaces into the container
COPY ./src/backend src/backend
COPY ./src/shared src/shared

# Install dependencies for all workspaces
RUN npm install

# Set environment variables
ENV NODE_ENV=development
ENV PORT=5000

# Expose the backend server port
EXPOSE 5000

# Default command to start the backend server
CMD ["npm", "run", "dev:backend"]
