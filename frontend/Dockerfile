# Multi-stage build for Next.js frontend
# Stage 1: Dependencies and build environment
FROM node:18-alpine as dependencies

# Set working directory
WORKDIR /app

# Copy package files first for better caching
# This allows npm install to be cached if package.json hasn't changed
COPY package.json package-lock.json* ./

# Install dependencies
# --frozen-lockfile ensures exact versions from package-lock.json
RUN npm ci --frozen-lockfile

# Stage 2: Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy all source code
COPY . .

# Build the Next.js application
# This creates optimized production build in .next folder
RUN npm run build

# Stage 3: Development stage (for docker-compose)
FROM node:18-alpine as development

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for development)
RUN npm ci

# Copy source code
COPY . .

# Expose port 3000 for Next.js development server
EXPOSE 3000

# Set environment variable for Next.js
ENV NODE_ENV=development

# Command for development (with hot reload)
CMD ["npm", "run", "dev"]

# Stage 4: Production stage (optimized for deployment)
FROM node:18-alpine as production

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of app directory to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port 3000
EXPOSE 3000

# Command to start the production server
CMD ["npm", "start"]