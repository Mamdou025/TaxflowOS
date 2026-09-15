FROM node:24.21.0-bookworm-slim

# Read the pinned pnpm version from the repository instead of a floating major.
COPY package.json /opt/taxflow-toolchain/package.json
RUN npm install --global "$(node -p "require('/opt/taxflow-toolchain/package.json').packageManager")" \
    && npm cache clean --force

WORKDIR /app
