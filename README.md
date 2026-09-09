# ShowMySkills System 🚀

An open-source full-stack monorepo built with **Next.js** (Frontend), **Express Node.js** (Backend), **Swagger / OpenAPI**, **Docker & Docker Compose**, and automated **AWS EC2 Production CI/CD**.

🌐 **Production Website**: [https://showmyskills.xyphx.com](https://showmyskills.xyphx.com)  
🔌 **Production API Base**: [https://showmyskills.xyphx.com/api](https://showmyskills.xyphx.com/api)  
📘 **Swagger API Specs**: [https://showmyskills.xyphx.com/api/docs](https://showmyskills.xyphx.com/api/docs)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![AWS EC2 Production CI/CD](https://img.shields.io/badge/Deploy-Production%20EC2-orange.svg)](https://github.com/features/actions)

---

## 🌿 Git Branching & Production Deployment

- **`dev`**: Active feature development.
- **`production`**: Production branch. Pushes to `production` trigger automated deployment to AWS EC2.

---

## 🐋 Quickstart with Docker Compose

Run the entire full-stack system locally with containerized Nginx reverse proxy, Express API, Next.js frontend, and MongoDB:

```bash
docker compose up -d --build
```

- **Frontend Website**: `https://showmyskills.xyphx.com` (or `http://localhost:3000`)
- **Express API**: `https://showmyskills.xyphx.com/api` (or `http://localhost:5000/api`)
- **Swagger Documentation**: `https://showmyskills.xyphx.com/api/docs` (or `http://localhost:5000/api/docs`)

---

## 🚀 AWS EC2 Production Deployment

Pushing code to the **`production`** branch automatically triggers the deployment pipeline ([.github/workflows/deploy-ec2.yml](file:///.github/workflows/deploy-ec2.yml)).

### Required GitHub Secrets:
1. `EC2_HOST`: Public IP address or domain of EC2 instance.
2. `EC2_USER`: SSH User (e.g., `ubuntu` or `ec2-user`).
3. `EC2_SSH_KEY`: Private SSH Key content (.pem).

---

## 🤝 Contributing

Read our [CONTRIBUTING.md](file:///C:/Users/sidha/OneDrive/Desktop/CodeDOT/ShowMySkills-system/CONTRIBUTING.md) and adhere to our [CODE_OF_CONDUCT.md](file:///C:/Users/sidha/OneDrive/Desktop/CodeDOT/ShowMySkills-system/CODE_OF_CONDUCT.md).

## 📜 License

Available under the [MIT License](file:///C:/Users/sidha/OneDrive/Desktop/CodeDOT/ShowMySkills-system/LICENSE).
