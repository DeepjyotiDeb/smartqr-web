#!/bin/bash

# DQR Web Deployment Script
# This script builds and deploys the dqr-web application to Azure Container Registry

set -e  # Exit on any error

echo "🚀 Starting DQR Web deployment..."

# Configuration
ACR_NAME="dqrcontainerregistry"
RESOURCE_GROUP="dqr-prod"
IMAGE_NAME="dqr-web"
TAG="latest"
BACKEND_API_URL="https://dqr-prod-api.azurewebsites.net/api/v1"
PLATFORM="linux/amd64"
BUILDER_NAME="multi"

echo "📋 Configuration:"
echo "  ACR Name: $ACR_NAME"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Image: $IMAGE_NAME:$TAG"
echo "  Backend API: $BACKEND_API_URL"
echo "  Platform: $PLATFORM"
echo ""

# Step 1: Login to Azure
echo "🔐 Logging into Azure..."
az login

# Step 2: Login to Azure Container Registry
echo "🔐 Logging into Azure Container Registry..."
az acr login --name $ACR_NAME --resource-group $RESOURCE_GROUP

# Step 3: Ensure buildx is ready
ensure_buildx() {
  if ! docker buildx inspect "${BUILDER_NAME}" >/dev/null 2>&1; then
    echo "🔧 Creating buildx builder '${BUILDER_NAME}'..."
    docker buildx create --use --name "${BUILDER_NAME}"
  else
    echo "🔧 Using existing buildx builder '${BUILDER_NAME}'..."
    docker buildx use "${BUILDER_NAME}"
  fi
  echo "🔧 Bootstrapping buildx builder..."
  docker buildx inspect --bootstrap >/dev/null
}

# Step 4: Build and push with buildx
echo "🔨 Building and pushing Docker image with buildx..."
ensure_buildx

docker buildx build \
  --platform "${PLATFORM}" \
  --build-arg VITE_PUBLIC_BACKEND_API=$BACKEND_API_URL \
  -t $ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG \
  --push \
  .

echo ""
echo "✅ Deployment completed successfully!"
echo "📦 Image pushed to: $ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG"
echo ""
echo "🔄 Next steps:"
echo "  1. Update your Azure Container Instance or App Service to use the new image"
echo "  2. Restart the service to pull the latest image"
echo ""
