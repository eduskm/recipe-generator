# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

# Change to development environment since you need dev dependencies for vite
ENV NODE_ENV development

WORKDIR /usr/src/app

# Remove the --omit=dev flag to install ALL dependencies including vite
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Stay as root user for development to avoid permission issues with mounted volumes
# (for production, you would want to use the node user)

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm run dev