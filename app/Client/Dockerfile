# --- Stage 1: Builder ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# CONFIGURATION INJECTION:
# Modify the API service file to use the relative path '/api' instead of 'http://localhost:4000'.
# This allows Nginx to handle the routing securely.
RUN sed -i 's|http://localhost:4000|/api|g' app/services/api.ts

# Compile the React app
RUN npm run build

# --- Stage 2: Production Server ---
FROM nginx:alpine

# Copy the compiled assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]