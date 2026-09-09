# Project Guidelines & Architecture

## Overview
This is an open-source monorepo containing:
- **`web/`**: Next.js App Router frontend (JavaScript).
- **`api/`**: Express.js REST API with Swagger documentation and MongoDB integration (JavaScript).
- **`packages/`**: Shared workspace modules (`@monorepo/types`, `@monorepo/validation`, `@monorepo/config`).

## Rules & Coding Standards
1. **No Hardcoded URLs**: Never hardcode default localhost API endpoints in source code. Always consume environment variables (`process.env.NEXT_PUBLIC_API_URL`, `process.env.MONGODB_URI`, `process.env.PORT`) with validation.
2. **API Documentation**: All Express API endpoints must be documented using Swagger JSDoc annotations and served via Swagger UI at `/api-docs`.
3. **Open Source Best Practices**: Maintain detailed issue templates, pull request templates, security policy, code of conduct, and clear contribution guidelines.
