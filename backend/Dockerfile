FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY . ./src
COPY tsconfig.json .

CMD \
  if [ -f yarn.lock ]; then yarn start:watch; \
  elif [ -f package-lock.json ]; then npm run start:watch; \
  elif [ -f pnpm-lock.yaml ]; then pnpm start:watch; \
  else yarn start:watch; \
  fi