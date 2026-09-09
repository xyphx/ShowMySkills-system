# Development & Deployment Setup Guide

## 🌿 Git Branching Strategy

- **`dev`**: Primary branch for ongoing active development.
- **`production`**: Production-ready branch triggering continuous deployment to AWS EC2.

### Deploying to Production Branch
To release changes to production:
```bash
git checkout production
git merge dev
git push origin production
```

---

## 🐋 Docker & Docker Compose Setup

Run the entire stack (Next.js web, Express API, and MongoDB) using Docker Compose:

### Start All Services
```bash
docker compose up -d --build
```

### Check Service Logs
```bash
docker compose logs -f
```

### Stop All Services
```bash
docker compose down
```

---

## 🚀 AWS EC2 Production Continuous Deployment (GitHub Actions)

The project includes automated production deployment to AWS EC2 via GitHub Actions ([.github/workflows/deploy-ec2.yml](file:///.github/workflows/deploy-ec2.yml)).

Pushing to the **`production`** branch automatically triggers EC2 deployment.

### Required GitHub Secrets
Configure the following secrets in your GitHub repository (**Settings > Secrets and variables > Actions**):

- `EC2_HOST`: The public IP address or DNS domain of your AWS EC2 instance.
- `EC2_USER`: The SSH username (e.g. `ubuntu`, `ec2-user`).
- `EC2_SSH_KEY`: The private RSA/ED25519 SSH key (.pem) used to connect to EC2.
- `EC2_PORT`: *(Optional)* SSH port (default is `22`).
