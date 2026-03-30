# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Only copy production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled source from build stage
COPY --from=build /app/dist ./dist
# Ensure uploads and logs folders exist
RUN mkdir -p uploads logs

# Environment variables (to be overridden at runtime)
ENV PORT=3000
ENV NODE_ENV=production

# The CMD is specified in docker-compose for each service
EXPOSE 3000
