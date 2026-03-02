# 🌐 Production-Ready Static Website Deployment (DevOps CI/CD Pipeline)

This repository demonstrates a complete DevOps workflow for building, containerizing, and deploying a static website using Docker, Jenkins, and Kubernetes.

It is designed to showcase practical CI/CD implementation and container orchestration in a real-world infrastructure setup.

---

## 📌 Project Overview

This project implements:

- Source code management with GitHub
- Containerization using Docker
- Automated CI/CD pipeline using Jenkins
- Kubernetes-based deployment
- Infrastructure-ready configuration for scalable environments

The architecture follows modern DevOps best practices for automated build and deployment pipelines.

---

## 🏗️ Architecture Flow


Developer → GitHub → Jenkins Pipeline → Docker Build → Docker Hub → Kubernetes Cluster


### Pipeline Stages:

1. Source Code Checkout
2. Docker Image Build
3. Docker Image Push to Docker Hub
4. Kubernetes Deployment Update
5. Rollout Verification

---

## 📂 Repository Structure


.
├── chromosoft-website/ # Static website source code
├── k8s/ # Kubernetes Deployment & Service manifests
├── Dockerfile # Docker image build instructions
├── Jenkinsfile # CI/CD pipeline configuration
└── README.md


---

## 🛠️ Technology Stack

| Layer              | Technology Used |
|--------------------|-----------------|
| Version Control    | Git & GitHub |
| CI/CD              | Jenkins |
| Containerization   | Docker |
| Image Registry     | Docker Hub |
| Orchestration      | Kubernetes |
| Web Server         | Nginx (inside container) |

---

## 🐳 Docker Implementation

The application is containerized using a custom Dockerfile.

### Build Image

docker build -t <dockerhub-username>/website:latest .
Push Image
docker login
docker push <dockerhub-username>/website:latest
### ☸️ Kubernetes Deployment

Kubernetes manifests are located in the k8s/ directory.

Deploy to Cluster
kubectl apply -f k8s/
Verify Deployment
kubectl get pods
kubectl get svc

Ensure your kubeconfig context is set correctly before deployment.

### 🔄 Jenkins CI/CD Pipeline

The Jenkinsfile automates:

SCM checkout from GitHub

Docker build process

Docker Hub authentication

Image push

Kubernetes deployment update

Required Jenkins Credentials

Docker Hub credentials (username/password)

Kubernetes kubeconfig (Secret File credential)

### 📈 Scalability & Production Considerations

This setup supports:

Horizontal pod scaling (HPA-ready)

Rolling updates

Container versioning

Automated build triggers

Secure credential management

Infrastructure portability

### 🔐 Security Practices

Credentials stored securely in Jenkins

No hardcoded secrets

Kubernetes namespace isolation

Controlled Docker image versioning

### 🚀 Local Development (Optional)

For static preview:

cd chromosoft-website
npx serve .

Or open index.html directly in a browser.

### 🎯 Purpose of This Repository

This repository demonstrates hands-on experience in:

End-to-end CI/CD automation

Container lifecycle management

Kubernetes-based deployment workflows

Production-style DevOps pipeline implementation

It is suitable for DevOps Engineer / Cloud Engineer portfolio demonstration.

### 👨‍💻 Maintainer

Vishnu Solanki
GitHub: https://github.com/solankivishnu63

### ⭐ If you find this project useful, feel free to star the repository.


---

If you want next-level improvement, I can now:

- Add **professional GitHub badges**
- Add **Helm-based deployment version**
- Add **AWS EKS architecture diagram**
- Convert this into a resume-ready project description**
- Or optimize it specifically for DevOps job applications**

Tell me your goal — portfolio, job-ready, or production refinement.
