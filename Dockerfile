FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
ARG VITE_PUBLIC_BACKEND_API
RUN echo "VITE_PUBLIC_BACKEND_API=$VITE_PUBLIC_BACKEND_API" > .env.production
ENV VITE_PUBLIC_BACKEND_API=$VITE_PUBLIC_BACKEND_API
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve
COPY --from=build-env /app/build/client /app/build/client
COPY web.config /app/build/client/
WORKDIR /app/build/client
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]