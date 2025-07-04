# Docker Configuration for Karaoke App

This directory contains the centralized Docker configuration for the karaoke application.

## Structure

```
docker/
├── Dockerfile.backend       # Backend Go application
├── Dockerfile.frontend      # Frontend React application  
├── nginx.conf               # Nginx configuration for frontend
├── docker-compose.yml       # Production compose configuration
├── docker-compose.dev.yml   # Development compose configuration
└── README.md                # This file
```

## Files

### Dockerfile.backend
- Multi-stage build for Go 1.22 application
- Optimized for production with minimal Alpine Linux image
- Builds from `backend/` directory

### Dockerfile.frontend  
- Multi-stage build for React TypeScript application
- Uses Node.js 18 for building, Nginx for serving
- Builds from `frontend/` directory
- Includes custom nginx configuration

### docker-compose.yml
- Production configuration for all services
- Optimized for deployment with proper networking
- Uses standard ports (80, 8080, 27017)

### docker-compose.dev.yml  
- Development configuration with non-conflicting ports
- Volume mounts for live code changes
- Uses ports 8080, 8082, 27018 to avoid conflicts

### nginx.conf
- Custom Nginx configuration for serving the React app
- Configured for SPA routing with fallback to index.html
- API proxy configuration for backend requests

## Usage

### Development Environment

Run the complete stack from the docker directory:
```bash
cd docker
docker compose -f docker-compose.dev.yml up
```

Or from the project root:
```bash
docker compose -f docker/docker-compose.dev.yml up
```

### Production Environment

Run the production stack:
```bash
cd docker  
docker compose up
```

Or from the project root:
```bash
docker compose -f docker/docker-compose.yml up
```

Access the application:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8082/api
- MongoDB: localhost:27018

### Building Individual Images

From the project root directory:

Backend:
```bash
docker build -f docker/Dockerfile.backend -t karaoke-backend .
```

Frontend:
```bash
docker build -f docker/Dockerfile.frontend -t karaoke-frontend .
```

## Key Changes from Previous Setup

1. **Centralized Configuration**: Moved all Docker files including docker-compose files to centralized `docker/` directory
2. **Updated Go Version**: Backend now uses Go 1.22 (from 1.19) to match go.mod requirements
3. **Fixed TypeScript Issues**: Resolved `verbatimModuleSyntax` compilation errors by using type-only imports
4. **Unified Compose**: Docker compose files now centralized with proper build contexts
5. **Port Configuration**: Uses non-conflicting ports (8080, 8082, 27018) for development

## Development Notes

- Both backend and frontend Docker images build successfully
- All TypeScript compilation errors have been resolved
- MongoDB, backend, and frontend containers communicate properly
- API endpoints are functional and tested
- Frontend serves correctly through Nginx
