#  CodeJudge - AI-Powered Online Judge Platform

**CodeJudge** is a full-stack, scalable, microservices-based **AI-powered online judge system** that transforms traditional problem-solving into an intelligent, user-friendly experience. It incorporates **LangChain**, **Zod**, and **AWS services** for intelligent assistance and efficient code evaluation.

🌐 **Live Link:** [https://www.sbcsb.in](https://www.sbcsb.in)

---

## Architecture Overview

This project is structured into three microservices, each handling a distinct concern for modularity and scalability:

| Microservice | Description |
|--------------|-------------|
| `client/`    | Frontend built using React + Tailwind CSS. Hosted on **Vercel**. |
| `src/`       | Backend built with Node.js/Express, dockerized, and utilizes **Nginx** with **Certbot** SSL. |
| `compiler/`  | Isolated code compilation service with language support (C++, Python), containerized via Docker. |

---

## 🌟 Features

###  AI-Powered Enhancements
- **Debug Suggestions** via LangChain
- ** Hint Generation** powered by **LangChain** + **Zod** for schema validation

### Problem-Solving
- Real-time **code execution** and **verdict system**
- Upload, manage, and test problems with **S3-based** test case storage
- Boilerplates for problems related to Linked List
- **Leaderboard** and **submission history**
- Contest system (🚧 *In Progress*)

### 👥 Community Features
- **Discussion threads** stored in **AWS DynamoDB**
- Smart responses and AI moderation features (to be added)

### 🛡️ Authentication & Security
- Session-based authentication using **Passport.js**
- Backend secured via **HTTPS** using **Certbot + Nginx**

### ☁️ Cloud & Infrastructure
- **MongoDB Atlas** for core data storage
- **AWS S3** for test cases
- **AWS ECR** to store production Docker images
- Fully **Dockerized backend & compiler** services
- **Internal Docker network** for secure inter-service communication

---

##  Deployment Details

### 🌐 Frontend (`client`)
- Built using **React** and **Tailwind CSS**
- Deployed on **Vercel**
- Dynamically fetches backend endpoints from environment variables

### 🧠 Backend (`src`)
- Dockerized Node.js/Express server
- Serves authentication, problem management, and user operations
- Proxied through **Nginx**
- SSL enabled via **Let's Encrypt (Certbot)**
- Communicates with MongoDB, S3, DynamoDB, and Compiler service

### ⚙️ Compiler (`compiler`)
- Docker-based secure sandbox environment
- Supports code execution for:
  - **C++**
  - **Python**
- Connected with backend through internal Docker networking
- Language extensibility possible

---

## 🔐 Backend Environment Variables

 `.env` file for `src/`(entire backend basically) should contain the following:

```env
# Database
MONGODB_CONNECTION_STRING=       # MongoDB Atlas URI

# Auth & Session
SESSION_SECRET=                  # Express session secret
CLIENT_URL=                      # https://www.sbcsb.in (frontend)

# Compiler
COMPILER_BACKEND_URL=            # Internal URL for compiler microservice

# AWS (for S3 and DynamoDB)
AWS_REGION=                      # AWS region (e.g., ap-south-1)
AWS_ACCESS_KEY_ID=               # IAM user credentials
AWS_SECRET_ACCESS_KEY=           # IAM secret key
AWS_BUCKET_NAME=                 # S3 bucket name for test case storage

# AI Services
GOOGLE_API_KEY=                  # For LangChain AI-enhanced features
