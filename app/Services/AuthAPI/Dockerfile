# --- Stage 1: Builder ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install production dependencies
RUN npm ci --omit=dev

# --- Stage 2: Production ---
FROM node:18-alpine
WORKDIR /app
# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 4002
# Just start the app (DB init is handled separately)
CMD ["node", "app/app.js"]