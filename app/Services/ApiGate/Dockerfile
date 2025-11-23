# --- Stage 1: Builder ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# --- Stage 2: Production ---
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# --- FIX: Patch Middleware Communication ---
# 1. Fix Auth Middleware: Replace hardcoded localhost URL with the environment variable
RUN sed -i 's|"http://localhost:4002/verify"|(process.env.AUTH_SERVICE_URL + "/verify")|g' app/src/middleware/authMiddleware.js

# 2. Fix Logger Middleware: Replace incorrect env var name (SERVICES_LOGS) with the standard one (LOGS_SERVICE_URL)
RUN sed -i 's|process.env.SERVICES_LOGS|process.env.LOGS_SERVICE_URL|g' app/src/middleware/loggerMiddleware.js

EXPOSE 4000
CMD ["node", "app/app.js"]