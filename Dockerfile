FROM node:22-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Build
RUN pnpm build

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["pnpm", "start"]
