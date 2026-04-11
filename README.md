# JobNexus - MERN Job Portal with Resume Builder

JobNexus is a full-stack MERN platform that combines job discovery and hiring workflows with an integrated ATS-focused resume builder.

It supports three roles:
- Candidate: build resumes, apply to jobs, track applications
- Employer: post jobs, review applicants, manage hiring pipeline
- Admin: moderate users, jobs, applications, and job reports

## Live Links
- Frontend: https://job-portal-resume-builder.vercel.app
- Backend API: https://job-portal-backend-hptt.onrender.com

## Core Features

### Candidate Features
- Register and login as candidate
- Browse and filter jobs
- View job details
- Apply to jobs using selected resume
- Track applications from My Applications page with status timeline
- Build and manage multiple resumes
- Download resume as PDF

### Employer Features
- Register and login as employer
- Complete company profile
- Post and edit jobs
- Close or reopen jobs
- View applicants for each job
- Accept or reject candidate applications

### Admin Features
- Admin dashboard with key platform metrics
- Manage users (verify, suspend, role changes)
- Manage jobs (approve, reject, feature, flag, activate/deactivate)
- View all applications
- Review and resolve reported jobs

### Resume Builder Features
- Structured sections: personal info, education, experience, projects, skills, languages, certifications
- Live preview while editing
- Multiple resume management (save, rename, delete)
- Resume view page for candidate and employer contexts
- PDF export via React PDF renderer

## Tech Stack

### Frontend
- React 19 with Vite
- React Router
- Tailwind CSS v4
- React Icons
- React Hot Toast
- @react-pdf/renderer

### Backend
- Node.js
- Express.js 5
- MongoDB with Mongoose
- JWT + bcryptjs
- cookie-parser
- CORS with credentials

## Authentication and Session Strategy

- Backend issues JWT on login
- JWT is stored in httpOnly cookie named token
- Frontend uses credentials include for protected API calls
- UI state uses readable cookies: session, role, name, email, userId, companyName
- Role protection is applied on both frontend routes and backend middleware

## Project Structure

### Frontend
- src/main.jsx: app routes and role-based route setup
- src/components: shared UI and utility components
- src/pages: page-level modules (candidate, employer, admin)
- src/utils/cookies.js: cookie helpers
- src/config.js: API base URL

### Backend
- backend/server.js: express app bootstrap
- backend/config/db.js: MongoDB connection helper
- backend/models: User, Job, Application, Resume, JobReport schemas
- backend/controllers: business logic per module
- backend/routes: REST route definitions
- backend/middleware: auth and role guards

## API Modules

- Auth: register, login, logout, me, verify-password
- Jobs: create, read, update, delete, close, reopen, report
- Applications: apply, my applications, applicants list, status update
- Resume: save, list, get one, rename, delete
- Users: profile read/update, credentials update, delete account, companies
- Admin: dashboard, users, jobs, applications, reports

## Local Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas URI or local MongoDB

### 1) Clone and install

Frontend install:

```bash
npm install
```

Backend install:

```bash
cd backend
npm install
```

### 2) Environment variables

Create backend .env in backend folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
PORT=5000
```

Create frontend .env in root folder:

```env
VITE_API_URL=http://localhost:5000
```

### 3) Run the app

Run backend:

```bash
cd backend
npm run dev
```

Run frontend:

```bash
npm run dev
```

## Build and Deployment

### Frontend (Vercel)
- Build command: npm run build
- Output directory: dist
- SPA rewrite configured in vercel.json

### Backend (Render or similar)
- Start command: npm start
- Set environment variables from the backend section above
- Ensure CORS_ORIGINS contains your frontend domain without trailing slash

Example production CORS_ORIGINS value:

```env
CORS_ORIGINS=https://job-portal-resume-builder.vercel.app
```

## Important Implementation Notes

- Cookie auth with cross-origin requires credentials include on frontend fetch calls
- In production, secure cookies require HTTPS
- If frontend and backend are on different domains, review sameSite cookie behavior as needed
- docs folder is currently empty and can be used for API docs and architecture diagrams

## Scripts

Root scripts:
- npm run dev: start Vite dev server
- npm run build: production build
- npm run preview: preview production build
- npm run lint: lint frontend

Backend scripts:
- npm run dev: start backend with nodemon
- npm start: start backend with node

## Roadmap Ideas

- Add centralized API documentation in docs
- Add rate limiting and CSRF hardening
- Add tests for critical auth and role-based flows
- Add saved jobs/bookmarks and notifications
- Add more resume templates and customization options

## Known Issues / Next Steps (Recruiter and Interviewer Notes)

Current known gaps being actively improved:
- Some backend routes still need tighter ownership checks to fully prevent cross-user updates.
- API responses are not yet fully standardized across all modules.
- Cookie security policy may need stricter sameSite handling for all cross-domain production cases.
- No centralized validation layer yet (currently mostly route/controller-level validation).

Next implementation priorities:
- Add centralized request validation (for auth, jobs, applications, profile updates).
- Add rate limiting and stronger abuse protection on auth/report endpoints.
- Add automated tests for role-based access and application status transitions.
- Add centralized API documentation in docs for easier onboarding and QA.
- Add production monitoring/logging and improve operational observability.

## Authors

- GitHub Copilot (GPT-5.3-Codex) - documentation and architecture support

## License

MIT
