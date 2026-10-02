# Full Stack Bookstore App

A complete, full-stack Bookstore application featuring a modern, glassmorphic UI, shopping cart, favorites, user authentication, and admin dashboard.

## Overview

This project is divided into two parts:
- **Frontend**: A Next.js (App Router, TypeScript) application with a modern, glassmorphic editorial design system, leveraging Tailwind CSS and framer-motion/GSAP for micro-animations.
- **Backend**: A Node.js & Express REST API using MongoDB as the database, handling user authentication, book catalog management, cart, and orders.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (Auth state), React Query (Data fetching)
- **Animations**: GSAP, Motion (Framer Motion)
- **Components**: Radix UI primitives, Lucide React icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcrypt (password hashing)
- **Security**: Helmet, CORS

## Features

- **User Authentication**: Sign up, login, and JWT-based session management.
- **Book Catalog**: Browse books with an elegant UI.
- **Shopping Cart**: Add, remove, and manage cart items.
- **Favorites**: Save books to a favorites list.
- **Checkout & Orders**: Place orders and view order history.
- **Admin Dashboard**: Manage (add/edit/delete) books, and view all system orders.
- **Responsive Design**: fully optimized for mobile and desktop screens.
- **Glassmorphism**: Premium aesthetic with translucent overlays and blurred backgrounds.

## Local Setup

### 1. Database Setup
Ensure you have a MongoDB instance running locally or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Configure environment variables. Create a `.env` file in the `backend` folder:
```env
PORT=1000
URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:
```bash
npm start
```
*(Server will start on `http://localhost:1000`)*

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Configure environment variables. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Update `.env.local` to point to your backend URL if it differs from the default:
```env
NEXT_PUBLIC_API_URL=http://localhost:1000/api/v1
NEXT_PUBLIC_CURRENCY=USD
NEXT_PUBLIC_SITE_NAME=Bookstore
```

Start the development server:
```bash
npm run dev
```
*(Frontend will start on `http://localhost:3000`)*

## Admin Access
Currently, there is no direct route to create an admin account from the UI. To test admin features:
1. Sign up for a normal account.
2. Open your MongoDB database (e.g., using MongoDB Compass).
3. Update the `role` field for your user document to `"admin"`.
4. Sign out and back in on the frontend.

## Deployment
For a detailed guide on how to deploy this application for free using MongoDB Atlas, Render, and Vercel, please check the instructions inside the project.

## License
MIT License
