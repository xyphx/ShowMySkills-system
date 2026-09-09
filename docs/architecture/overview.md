# System Architecture Overview

This monorepo is structured into frontend, backend API, and shared workspace packages:

- **Frontend (`web/`)**: Next.js App Router application built with React and Tailwind CSS.
- **Backend (`api/`)**: Express.js REST API with MongoDB/Mongoose data models.
- **Shared Packages (`packages/`)**:
  - `types`: Shared TypeScript/JSDoc types.
  - `validation`: Shared Zod validation schemas.
  - `config`: Shared application constants and configuration.
