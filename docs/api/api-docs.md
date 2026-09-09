# Express REST API Documentation

Base Endpoint: `http://localhost:5000/api`

## Interactive Swagger UI Documentation
Explore and test all API endpoints live via Swagger UI at:
```
http://localhost:5000/api/docs
```

## Available API Routes Prefix (`/api/*`)

- **Swagger Docs**: `GET /api/docs`
- **Health Check**: `GET /api/health`
- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Catch-All Handler**: `ALL /api/*` (returns 404 JSON response for any undefined route e.g., `/api/gieigjeijgjejjegj`)
