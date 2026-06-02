# OpenSourceX

OpenSourceX is a MERN stack application designed to help developers sync, track, and analyze their GitHub contributions in a clean, modern portfolio. It provides insights into commit habits, open/merged pull requests, active coding streaks, language statistics, and allows downloading generated PDF contribution reports.

---

## Architecture & Tech Stack
* **Frontend**: React (Vite), Tailwind CSS, TanStack React Query, Axios, Lucide React, Recharts.
* **Backend**: Node.js, Express, Mongoose (MongoDB), JSON Web Tokens (JWT) for authentication.
* **OAuth Integration**: GitHub OAuth API.

---

## Local Setup & Development

### 1. Prerequisite Installations
Ensure you have Node.js (v18+) and npm installed.

### 2. Install Dependencies
Run the following command in the project root to install packages for the root, backend, and frontend:
```bash
npm run install-all
```

### 3. Environment Configurations
You need to create two environment configuration files:

#### Backend Config (`backend/.env`):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
CLIENT_URL=http://localhost:5173
```

#### Frontend Config (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Create local GitHub OAuth App
1. Go to your GitHub profile -> **Settings** -> **Developer Settings** -> **OAuth Apps** -> **New OAuth App**.
2. Set the following details:
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5000/api/auth/callback`
3. Generate a Client Secret, and copy both the Client ID and Client Secret into your `backend/.env`.

### 5. Running the App Locally
From the root folder, run:
```bash
npm run dev
```
This runs both the React frontend (port `5173`) and Express backend (port `5000`) concurrently.

---

## Production Deployment Guide

We deploy the **Backend on Render** and the **Frontend on Vercel**.

### 1. MongoDB Network Access Setting (Crucial)
Because Render web services use dynamic IP addresses, you must configure MongoDB Atlas to accept connections from your live service:
1. Log into your **MongoDB Atlas** dashboard.
2. Navigate to **Network Access** under Security.
3. Click **Add IP Address** and enter `0.0.0.0/0` (Allow Access from Anywhere).

### 2. Backend Deployment on Render
1. Sign in to [Render](https://render.com) and click **New** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `opensourcex-backend`
   - **Runtime**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables**:
   - `MONGODB_URI`: (Your production MongoDB database URI)
   - `JWT_SECRET`: (A secure random string)
   - `JWT_REFRESH_SECRET`: (A secure random string)
   - `GITHUB_CLIENT_ID`: (Your production GitHub OAuth Client ID)
   - `GITHUB_CLIENT_SECRET`: (Your production GitHub OAuth Client Secret)
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (Your Vercel URL, created in Step 3)
   - `BACKEND_URL`: `https://opensourcex-backend.onrender.com` (Your Render URL)
5. Deploy the web service and copy its live URL.

### 3. Frontend Deployment on Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: `Vite` (automatically detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variable**:
   - `VITE_API_URL`: `https://opensourcex-backend.onrender.com/api` (The Render backend URL + `/api`)
5. Click **Deploy**.

### 4. Create Production GitHub OAuth App
Create a separate GitHub OAuth App for production:
* **Homepage URL**: `https://your-frontend.vercel.app`
* **Authorization callback URL**: `https://opensourcex-backend.onrender.com/api/auth/callback`
Copy its Client ID and Secret and update them in the Render environment variables.
