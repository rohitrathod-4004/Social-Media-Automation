> **⚠️ Deployment Notice**
>
> The frontend is currently deployed and available through the Live Demo. The backend service is currently inactive because the project uses an in-process Node.js cron scheduler and the backend is hosted on a free-tier web service. The backend can be reactivated when the application needs to be demonstrated or used. The repository contains the complete backend implementation.

# SocialFlow

**AI-Powered Social Media Automation Platform**

SocialFlow is a comprehensive full-stack workspace that simplifies the social media content lifecycle. It provides an intuitive, premium dashboard to connect various social platforms, generate platform-specific content using AI, and schedule posts across multiple networks from a single command center.

---

## Live Demo
[https://social-media-automate.onrender.com/](https://social-media-automate.onrender.com/)

*(Please refer to the Deployment Notice regarding backend status during demonstrations).*

---

## Overview

SocialFlow eliminates the need to manage multiple tabs and native scheduling tools. It is designed for content creators, agencies, and brands who want to streamline their publishing workflow. 

Users authenticate securely, connect their desired social accounts via an integrated OAuth flow, and use an AI-assisted Composer to generate content tailored to the voice and constraints of each platform. From there, posts are validated, previewed, and scheduled in a robust, unified Queue, ready to be automatically published by the background worker.

---

## Key Features

- **Authentication & Security:** Secure JWT-based authentication with encrypted passwords.
- **Unified Dashboard:** A premium, "Command Center" interface displaying real-time metrics and recent activity.
- **Social Account Integration:** Seamless OAuth connections to major social platforms.
- **AI-Assisted Composer:** Integrated Google Gemini AI to draft, rephrase, and tailor posts per platform.
- **Rich Media Support:** Image and video uploads with robust validation, backed by Cloudinary.
- **Advanced Scheduling:** A unified queue system managing Drafts, Upcoming, Published, and Failed posts.
- **Automated Publishing:** In-process Node.js cron scheduler managing reliable delivery.
- **Failure Recovery:** Graceful error handling with an "Edit & Retry" flow for failed posts.

---

## How the System Works

The SocialFlow architecture relies on a clear separation of concerns, leveraging third-party APIs to handle heavy infrastructure:

1. **User Action:** The user interacts with the React frontend (SocialFlow Workspace) to create and schedule content.
2. **Backend API:** The Node.js/Express backend handles validation, stores post data in MongoDB, and manages the publishing queue.
3. **Zernio Integration:** At the scheduled time, the backend communicates with the **Zernio API**, which abstracts the complex underlying OAuth refreshes and direct API integrations of individual social networks. 
4. **Publishing:** Zernio securely delivers the finalized media and content directly to the connected platforms.

---

## Scheduler Architecture

The application implements a robust, autonomous scheduling system:

- **Implementation:** The backend utilizes `node-cron` to continuously check the MongoDB database for posts that have reached their scheduled time.
- **State Management:** Posts move dynamically between `draft`, `scheduled`, `published`, and `failed` states.
- **Architectural Consideration:** The scheduler currently runs **in-process** on the Node.js backend server. 
- **Deployment Implication:** Because the backend is hosted on a free-tier web service that suspends during inactivity, the in-process cron job will also suspend. For a production-scale deployment, this scheduler could easily be separated into a dedicated background worker (e.g., BullMQ + Redis) or a serverless cron trigger (like AWS EventBridge).

---

## AI Integration

SocialFlow utilizes Google's **Gemini AI** (`@google/genai`) to power the AI Composer. 
- **Implementation:** The AI is used to take a single source idea and automatically adapt it into distinct voices and formats optimized for selected platforms.
- **Workflow:** Users provide a prompt and tone, and the backend communicates with Gemini to return structured, platform-ready copy that the user can review and edit before scheduling.

---

## Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router, Lucide React, Axios |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB, Mongoose |
| **Integrations** | Zernio API (Social Publishing), Google Gemini (AI), Cloudinary (Media) |
| **Architecture** | JWT Auth, `node-cron` (Scheduling), Multer (File parsing) |
| **Deployment** | Render (Typical usage for this architecture) |

---

## Project Structure

```text
SocialFlow/
├── frontend/
│   ├── public/          # Static assets (logo.svg)
│   ├── src/
│   │   ├── api/         # Axios configurations
│   │   ├── components/  # Reusable UI elements & layouts
│   │   ├── context/     # React Context (Auth)
│   │   ├── pages/       # Route-level components (Scheduler, Dashboard, AI Composer)
│   │   └── utils/       # Validation logic
│   └── package.json
├── server/
│   ├── config/          # Database and environment configs
│   ├── controllers/     # Express route controllers
│   ├── middlewares/     # Auth and upload middlewares
│   ├── models/          # Mongoose schemas (Post, User)
│   ├── routes/          # Express API definitions
│   ├── services/        # AI and Scheduling logic
│   ├── server.ts        # Application entry point
│   └── package.json
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Zernio API Key
- Google Gemini API Key
- Cloudinary Account

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/SocialFlow.git
cd SocialFlow
```

### 2. Backend Setup
```bash
cd server
npm install
```
Configure your `.env` file (see Environment Variables section below).
```bash
npm run dev
# OR
npm run server
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the `server` directory based on the provided `.env.example`:

```env
# Express server port
PORT=3000

# Frontend URL allowed by CORS and used for OAuth callbacks
FRONTEND_URL=http://localhost:5173

# Database connection
MONGODB_URI=

# Authentication secret
JWT_SECRET=

# External service credentials
ZERNIO_API_KEY=
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
*Note: Never commit your `.env` file.*

---

## Deployment

- **Frontend:** Built via `vite build` and deployed as a static site.
- **Backend:** Deployed as a Node.js web service.
- **Current Status:** As mentioned in the notice, the backend is on a free-tier plan and goes to sleep when inactive. Consequently, the in-process `node-cron` scheduler will not publish posts while the server is asleep. Reactivating the server (via a web request) resumes scheduling.
- **Production Improvement:** For a highly available production environment, the backend should be moved to a standard active tier, or the scheduling logic should be extracted into a dedicated CRON infrastructure.

---

## Screenshots

*(Screenshots of the Dashboard, AI Composer, and Scheduler will be added here.)*

---

## API Documentation

Key backend routes handling the core functionality:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive JWT |
| `GET` | `/api/accounts` | Retrieve all connected social accounts |
| `DELETE` | `/api/accounts/:id` | Disconnect an account |
| `GET` | `/api/oauth/:platformId/url` | Generate Zernio OAuth connect URL |
| `POST` | `/api/posts` | Create or schedule a new post |
| `GET` | `/api/posts` | Retrieve user posts (Drafts, Scheduled, Published, Failed) |
| `PUT` | `/api/posts/:id` | Edit and retry a failed or scheduled post |

---

## Security

- **Environment Separation:** All sensitive keys (Database, JWT, API keys) are strictly managed via environment variables.
- **Authentication:** All protected routes utilize JWT verification middleware.
- **Password Hashing:** User passwords are encrypted via `bcrypt` before database storage.
- **CORS:** Controlled via the `FRONTEND_URL` environment variable.

---

## Future Improvements

- **Dedicated Worker Queue:** Extract the `node-cron` logic into a Redis-backed queue (e.g., BullMQ) for robust retry mechanics and true background processing.
- **Advanced Analytics:** Aggregate engagement metrics from published posts via the Zernio API.
- **Team Workspaces:** Introduce RBAC (Role-Based Access Control) to allow multiple users to manage a single queue.

---

## Project Motivation

SocialFlow was built as a comprehensive portfolio project to explore and demonstrate:
- End-to-end full-stack application development.
- The complexities of third-party OAuth workflows and external API abstractions.
- Implementing robust background processing and scheduled tasks within a Node ecosystem.
- Creating a premium, highly responsive user interface with modern React patterns.

---

**Author**  
Rohit Rathod
