# Blog Platform

A modern blog platform where users can create, read, and manage their blog posts.

## Features

- User authentication (signup, login, logout)
- Create, read, update, and delete blog posts
- Personal dashboard for managing posts
- Responsive design that works on all devices
- Real-time updates without caching

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js
- Express
- MongoDB
- JWT for authentication

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd blog-platform
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# In backend directory
cp .env.example .env
# Edit .env with your MongoDB and JWT settings
```

4. Start the development servers
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

5. Open http://localhost:3000 in your browser

## Project Structure

```
blog-platform/
├── frontend/          # Next.js frontend
│   ├── app/          # App router pages
│   ├── components/   # Reusable components
│   └── context/      # React context
└── backend/          # Express backend
    ├── src/
    │   ├── models/   # MongoDB models
    │   ├── routes/   # API routes
    │   └── middleware/# Custom middleware
    └── .env         # Environment variables
```

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user

### Posts
- GET /api/posts - Get all posts
- GET /api/posts/:id - Get single post
- POST /api/posts - Create new post
- PUT /api/posts/:id - Update post
- DELETE /api/posts/:id - Delete post

## Development

- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:5000
- MongoDB should be running locally or use MongoDB Atlas

## License

MIT 