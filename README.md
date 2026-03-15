# CodeJudge 🚀

CodeJudge is a robust, full-stack Online Judge (OJ) platform designed for hosting programming contests and individual problem-solving. It features a modern user interface, a secure code execution engine, and integrated AI-powered code reviews.

## 🌟 Key Features

-   **Multi-Language Support**: Submit and execute code in **C++** and **Python**.
-   **Real-time Code Execution**: Secure execution engine with time and memory limit enforcement (TLE/MLE).
-   **AI-Powered Code Review**: Integrated with **Google Gemini AI** to provide instant algorithmic feedback and optimization suggestions.
-   **Interactive Dashboard**: 
    -   **Activity Heatmap**: Track daily submission consistency.
    -   **Progress Charts**: Visualize problem-solving progress by difficulty (Easy, Medium, Hard).
    -   **Submission History**: Detailed logs of all previous attempts.
-   **Global Leaderboard**: Competitive ranking based on problem-solving performance.
-   **Authentication**: Secure login via local credentials or **Google OAuth 2.0**.
-   **Problem Management**: Dynamic problem creation and storage using **AWS S3** for test cases and assets.
-   **Modern UI**: Built with **React**, **Tailwind CSS**, and **shadcn/ui**, featuring a high-performance **Monaco Editor**.

## 🏗️ System Architecture

CodeJudge follows a microservices-inspired architecture:

1.  **Frontend**: A responsive React application (Vite-powered) that handles the user interface and code editing.
2.  **Backend**: An Express.js server managing users, problems, submissions, and AI integrations.
3.  **Online Compiler**: A dedicated service for executing untrusted code safely using a queue-based worker system (**Bull/Redis**).
4.  **Database & Storage**:
    -   **MongoDB**: Stores user profiles, problem metadata, and submission records.
    -   **Redis**: Powers the asynchronous job queue for code execution.
    -   **AWS S3**: Hosts large test case files and problem-related assets.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **State Management**: Redux Toolkit & Redux Persist
-   -   **Styling**: Tailwind CSS & shadcn/ui
-   **Code Editor**: Monaco Editor (@monaco-editor/react)
-   **Charts**: Recharts & Activity Heatmap

### Backend
-   **Runtime**: Node.js (Express)
-   **Database**: MongoDB (Mongoose)
-   **Queue**: Bull (Redis-backed)
-   **Auth**: Passport.js (Google OAuth 2.0) & JWT
-   **Cloud**: AWS SDK (S3), Google Gemini AI SDK

### Online Compiler
-   **Execution Engine**: Node.js Child Process
-   **Sandboxing**: Bash `ulimit` (Time & Memory limiting)
-   **Languages**: `g++` (C++17), `python3`

---

## 🚀 Getting Started

### Prerequisites
-   Docker & Docker Compose
-   Node.js (v18+)
-   AWS Account (for S3 storage)
-   Google Cloud Console (for OAuth & Gemini API)

### Environment Setup

Create `.env` files in both `backend/` and `Online-complier/` directories (refer to `.env.example` if available or the list below):

**Backend `.env`:**
```env
MONGO_URI=your_mongodb_uri
PORT=8000
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_API_KEY=your_gemini_api_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://redis:6379
```

**Online Compiler `.env`:**
```env
MONGO_URI=your_mongodb_uri
REDIS_URL=redis://redis:6379
```

### Running with Docker

The easiest way to start the entire stack is using Docker Compose:

```bash
docker-compose up --build
```

This will launch:
-   Frontend at `http://localhost:5173`
-   Backend at `http://localhost:8000`
-   Compiler at `http://localhost:3000`
-   Redis instance at `http://localhost:6379`

---

## 📁 Directory Structure

```text
CodeJudge/
├── backend/            # Express.js API & Business Logic
├── frontend/           # React Application
├── Online-complier/    # Code Execution Engine (Worker)
├── docker-compose.yaml # Orchestration
└── ...
```

## 📝 License
This project is licensed under the ISC License.
