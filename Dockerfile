FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --progress=false

# Copy source and build both client and server
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Production deps
COPY package*.json ./
RUN npm ci --production --no-audit --progress=false

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

ENV PORT=5000
EXPOSE 5000

CMD ["node", "dist/index.js"]
