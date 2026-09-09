# Docker Setup Guide

Complete Docker and Docker Compose setup for the Task Management App.

## Prerequisites

- Docker Desktop installed
- Docker Compose installed (comes with Docker Desktop)
- Git

## Quick Start with Docker Compose

### Start All Services

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (careful - deletes data!)
docker-compose down -v
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## Individual Docker Setup

### Build Backend Image

```bash
cd backend

# Build image
docker build -t task-management-api:latest .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/task-management \
  -e JWT_SECRET=your-secret-key \
  --name task-api \
  task-management-api:latest
```

### Build Frontend Image

```bash
cd frontend

# Build image
docker build -t task-management-ui:latest .

# Run container
docker run -p 3000:3000 \
  -e VITE_API_URL=http://localhost:5000/api \
  --name task-ui \
  task-management-ui:latest
```

### Run MongoDB

```bash
docker run -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  --name task-mongodb \
  -d mongo:latest
```

## Docker Compose Services

### Configuration

`docker-compose.yml` defines three services:

**MongoDB**
- Image: mongo:latest
- Port: 27017
- Credentials: admin/password
- Volume: mongodb_data (persistent)

**Backend**
- Built from: ./backend
- Port: 5000
- Depends on: MongoDB
- Environment: Configured via compose file

**Frontend**
- Built from: ./frontend
- Port: 3000
- Depends on: Backend
- Serves static files

### Network

All services communicate via `task-management-network`:
- Backend can reach MongoDB at `mongodb:27017`
- Frontend can reach Backend at `http://backend:5000`

## Environment Configuration

### MongoDB Atlas in Docker

To use MongoDB Atlas instead of local MongoDB:

```yaml
# docker-compose.yml
services:
  backend:
    environment:
      MONGODB_URI: mongodb+srv://user:password@cluster.mongodb.net/db
```

## Managing Containers

### View Running Containers

```bash
docker-compose ps

# Output:
# NAME               COMMAND                  STATUS      PORTS
# task-mongodb       docker-entrypoint.sh     Up 2 min    27017/tcp
# task-api          node server.js            Up 1 min    0.0.0.0:5000
# task-ui           serve -s dist -l 3000    Up 30 sec   0.0.0.0:3000
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100
```

### Access Container Shell

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# MongoDB
docker-compose exec mongodb mongosh -u admin -p password
```

## Data Persistence

### MongoDB Volume

MongoDB data is stored in `mongodb_data` volume:

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect task-management-app_mongodb_data

# Backup data
docker run --rm -v task-management-app_mongodb_data:/data \
  -v $(pwd)/backup:/backup \
  mongo:latest \
  mongodump --out /backup

# Restore data
docker run --rm -v task-management-app_mongodb_data:/data \
  -v $(pwd)/backup:/backup \
  mongo:latest \
  mongorestore /backup
```

## Building Production Images

### Multi-stage Build

The Dockerfile uses multi-stage builds to minimize image size:

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as builder
# Build stage
COPY . .
RUN npm run build

FROM node:18-alpine
# Production stage - only copies dist
COPY --from=builder /app/dist ./dist
```

### Image Size Optimization

Check image sizes:

```bash
docker images

# Output:
# REPOSITORY                       SIZE
# task-management-api             500MB
# task-management-ui              150MB (optimized)
```

Reduce size by:
- Using Alpine base images
- Multi-stage builds
- Excluding unnecessary files

### .dockerignore

```
node_modules
npm-debug.log
.env
.git
.DS_Store
dist
coverage
```

## Container Networking

### Connect Containers

```bash
# Create custom network
docker network create task-net

# Run containers on same network
docker run --network task-net --name db -d mongo:latest
docker run --network task-net -e DB_HOST=db -p 5000:5000 api:latest
```

### DNS Resolution

Within Docker network, containers resolve by service name:
- `mongodb` → resolves to MongoDB container
- `backend` → resolves to Backend container
- `frontend` → resolves to Frontend container

## Resource Limits

Set resource constraints:

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

Monitor resource usage:

```bash
docker stats

# Or with compose
docker-compose stats
```

## Health Checks

Add health checks to services:

```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

Check health:

```bash
docker-compose ps

# STATUS shows "healthy" or "starting"
```

## Security Best Practices

### Environment Variables

Never commit `.env` file:

```bash
# Use .env.example instead
MONGODB_URI=mongodb://localhost:27017/...
JWT_SECRET=change-this-in-production
```

Load from .env:

```bash
docker-compose --env-file .env up
```

### Image Security

```bash
# Use specific versions
FROM node:18.13.0-alpine

# Run as non-root
USER node

# Read-only filesystem
read_only: true
```

Scan for vulnerabilities:

```bash
docker scan task-management-api:latest
```

### Secrets Management

For production, use Docker Secrets:

```bash
# Create secret
echo "secret-value" | docker secret create jwt_secret -

# Use in compose
secrets:
  jwt_secret:
    external: true
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Port already in use: docker-compose down
# - Image build failed: docker-compose build --no-cache
# - Environment variables missing: check .env file
```

### Connection Refused

```bash
# Verify services are running
docker-compose ps

# Test connection
docker-compose exec backend curl http://mongodb:27017

# Check network
docker network inspect task-management-app_task-management-network
```

### Out of Disk Space

```bash
# Clean up unused resources
docker system prune -a

# Remove specific resources
docker-compose down -v  # Remove volumes
docker image prune      # Remove unused images
```

## Performance Tips

### Layer Caching

Order Dockerfile commands efficiently:

```dockerfile
# Bad - rebuilds on any change
COPY . .
RUN npm install

# Good - install layer cached
COPY package*.json ./
RUN npm install
COPY . .
```

### Parallel Builds

```bash
# Build multiple images in parallel
docker-compose build --parallel
```

## Production Deployment

### Using Kubernetes

Convert docker-compose to Kubernetes:

```bash
# Install Kompose
brew install kompose  # macOS
sudo apt-get install kompose  # Linux

# Convert
kompose convert -f docker-compose.yml

# Deploy to Kubernetes
kubectl apply -f *.yaml
```

### Using Docker Swarm

Initialize Swarm:

```bash
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml task-management

# View status
docker stack ps task-management
```

## Monitoring & Logging

### View Container Metrics

```bash
docker stats --no-stream
```

### Centralized Logging

Add to docker-compose.yml:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## Useful Commands

```bash
# List all containers
docker ps -a

# Remove stopped containers
docker container prune

# View image layers
docker history image-name

# Inspect container
docker inspect container-id

# Copy files from container
docker cp container:/app/file ./local/

# Commit container as image
docker commit container new-image:tag
```

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

---

For more help, check Docker documentation or open an issue.
