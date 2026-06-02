# OpenSourceX

This project was built using the MERN stack to help developers track their GitHub contributions and view analytics about their repositories.

## Project Structure

The project is split into two main folders:
- **backend**: Node + Express server that handles the MongoDB connection, routes, and GitHub OAuth login.
- **frontend**: React app built with Vite and styled using Tailwind. It connects to the backend using Axios and React Query.

## How to Set Up

### 1. Install dependencies
Run this command in the root folder to install all packages for both the backend and frontend:
```bash
npm run install-all
```

### 2. Set up the backend
Create a `.env` file in the `backend` folder with these variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
CLIENT_URL=http://localhost:5173
```

### 3. Create GitHub OAuth App
Go to GitHub developer settings and create a new OAuth app:
- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:5000/api/auth/callback`

Copy the Client ID and Secret to your backend `.env` file.

### 4. Set up the frontend
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the App

Start both the backend and frontend at the same time by running this command from the root folder:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Database Schemas

- **User**: Stores username, email, avatar, bio, and total contribution score.
- **Repository**: Stores sync'd repository name, stars, forks, and language.
- **Contribution**: Stores commits, PRs, issues, and reviews.
- **Notification**: Stores notifications for the user.
- **Report**: Tracks generated CSV and PDF reports.
