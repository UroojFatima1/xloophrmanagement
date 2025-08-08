# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build-time environment variables
ARG MONGO_URI
ARG JWT_SECRET
ENV MONGO_URI=$MONGO_URI
ENV JWT_SECRET=$JWT_SECRET

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
