# Blog Platform Frontend

This is the frontend for the Blog Platform built with Next.js 14 and TypeScript.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following content:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Project Structure

- `app/` - Next.js 14 app directory containing all pages and components
  - `page.tsx` - Home page (SSR)
  - `login/` - Login page
  - `signup/` - Signup page
  - `dashboard/` - Dashboard page (protected)
  - `layout.tsx` - Root layout with navigation
  - `globals.css` - Global styles

## Features

- Server-side rendering for the homepage
- Client-side routing
- Protected routes with JWT authentication
- Responsive UI with Tailwind CSS
- TypeScript for type safety

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
