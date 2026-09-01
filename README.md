
# Community Discussion Forum (Rustle Rustle)

An anonymous/semi-anonymous discussion board platform for QUT students and
community groups to share knowledge, ask sensitive questions without using
their real name, and self-organise into topic-based "Thickets" (discussion
boards).

**Live deployment:** http://52.63.96.167:5001

## Architecture Summary

MERN stack application (MongoDB, Express, React, Node.js):

- **Frontend**: React (`create-react-app`), React Router for navigation,
  Axios for API calls. Located in `/frontend`.
- **Backend**: Node.js + Express REST API, MongoDB via Mongoose, JWT-based
  authentication with bcrypt password hashing. Located in `/backend`.
- **Database**: MongoDB Atlas (cloud-hosted).
- **Deployment**: Single AWS EC2 instance (Ubuntu). The Express server
  serves both the REST API (`/api/*`) and the built React static files,
  so both frontend and backend run on the same port. Process kept alive
  with pm2.

### Roles

- **Member**: register/login, create posts, reply, search/filter, create
  a Thicket (discussion board — creator automatically becomes Moderator
  of that board), report posts, set a DiceBear-generated avatar.
- **Moderator**: all Member permissions, plus approve/remove members,
  create categories, set board rules, delete any post within their board.
- **Admin**: system-level role — publish notifications, view all board
  content, process reports, ban member accounts. (Partially implemented
  on the backend; see Known Limitations.)

## Setup Instructions (local development)

### Backend
\`\`\`bash
cd backend
npm install
# create a .env file with:
# MONGO_URI=<your MongoDB Atlas connection string>
# JWT_SECRET=<any secret string>
# PORT=5001
node server.js
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

Frontend dev server runs on `http://localhost:3000` and expects the backend
on `http://localhost:5001`.

## Deployment (EC2)

1. SSH into the EC2 instance and clone this repository.
2. Install Node.js, `cd backend && npm install`.
3. Create `.env` on the server with production MongoDB Atlas credentials.
4. `cd frontend && npm install && npm run build` — Express serves this
   build folder as static files.
5. Start the backend with pm2: `pm2 start server.js --name discussion-board-backend`
6. Ensure the EC2 Security Group allows inbound TCP on port 5001 from
   `0.0.0.0/0`, and MongoDB Atlas Network Access allows the EC2 instance's
   IP (or `0.0.0.0/0`).

## Known Limitations

- Reply/comment functionality (US3.1, US3.2) is implemented on the frontend
  only (local component state). The backend does not yet have a Comment/
  Reply model or API endpoint, so comments are not persisted to the
  database and will reset on page reload.
- The Home page's "Big Thicket" and "Recommended for you" sections display
  static placeholder content rather than live database data. The "My
  Thickets" section on the same page is fully wired to the real
  GET /api/boards endpoint.
- Admin role (notifications, cross-board moderation, ban) is designed and
  partially implemented on the backend; dedicated frontend screens for
  these are not yet built.
- No automated tests; verification was performed manually via Postman and
  browser testing.
- No CI/CD — deployment is manual, as permitted by the assignment scope.

## Tech Stack

MongoDB · Express · React · Node.js · JWT · bcrypt · DiceBear · pm2 · AWS EC2
