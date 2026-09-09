---
name: project-setup
description: Workflow for initializing and auditing open-source monorepo projects
---

# Project Setup Skill

When setting up or maintaining this open-source monorepo:
1. Verify all workspace dependencies in `web`, `api`, and `packages/*`.
2. Ensure environment variables are loaded via `.env` without hardcoded fallback URLs.
3. Validate OpenAPI/Swagger spec endpoint definitions in `api/src/config/swagger.js`.
4. Ensure every directory contains at least one source, config, or markdown file.
