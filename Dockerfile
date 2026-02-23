FROM node:20-alpine

# 1️⃣ Create non-root user first
RUN addgroup -S app && adduser -S app -G app

# 2️⃣ Create app folder and set permissions
RUN mkdir -p /app
WORKDIR /app
RUN chown -R app:app /app

# 3️⃣ Copy package files AS ROOT and install dependencies AS ROOT
COPY package.json package-lock.json* ./

# Optional: install dependencies as root to avoid permission issues
RUN npm install --production

# 4️⃣ Switch to non-root user AFTER install
USER app

# 5️⃣ Copy rest of the application code
COPY . .

# 6️⃣ Create uploads folder (non-root owned)
RUN mkdir -p uploads

# 7️⃣ Expose port
EXPOSE 5000

# 8️⃣ Healthcheck
HEALTHCHECK --interval=30s CMD node -e "require('http').get('http://localhost:5000')"

# 9️⃣ Start the app
CMD ["npm", "start"]
