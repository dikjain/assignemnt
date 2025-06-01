# Blog Platform Backend

This is the backend for the Blog Platform built with Node.js, Express, and TypeScript.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

3. Start MongoDB:
Make sure MongoDB is running on your system. You can start it using:
```bash
mongod
```

4. Run the development server:
```bash
npm run dev
```

The server will be available at http://localhost:5000.

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user

### Blog Posts
- GET /api/posts - Get all posts
- GET /api/posts/:id - Get single post
- POST /api/posts - Create new post (protected)
- PUT /api/posts/:id - Update post (protected)
- DELETE /api/posts/:id - Delete post (protected)

## Project Structure

- `src/` - Source code
  - `models/` - Mongoose models
  - `routes/` - API routes
  - `middleware/` - Custom middleware
  - `index.ts` - Application entry point

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests 