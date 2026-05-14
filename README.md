# MERN Stack Expense Tracker

A full-stack expense tracking application built with MongoDB, Express, React, and Node.js.

## Features

- User authentication (Register/Login)
- Add, edit, and delete expenses
- View expense summary by category
- Responsive dashboard with expense list
- Secure JWT-based authentication

## Tech Stack

### Backend
- Node.js & Express
- MongoDB (MongoDB Atlas)
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling
- React Hot Toast for notifications
- React Icons

## Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies (if not already installed):
```bash
npm install
```

Configure environment variables:
- Open `backend/.env`
- Update `MONGO_URI` with your MongoDB Atlas connection string
- Update `JWT_SECRET` with a secure random string

Example `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_secret_key_here
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies (if not already installed):
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port as shown in terminal)

## Usage

1. Open your browser and navigate to the frontend URL
2. Register a new account
3. Login with your credentials
4. Start adding expenses to track your spending

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all user expenses
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/expenses/summary` - Get expense summary

## Project Structure

```
JS-Pro/
├── backend/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js        # Authentication middleware
│   ├── models/
│   │   ├── User.js        # User model
│   │   └── Expense.js     # Expense model
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   └── expenses.js    # Expense routes
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Express server
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx  # Authentication context
    │   ├── pages/
    │   │   ├── Login.jsx        # Login page
    │   │   ├── Register.jsx     # Register page
    │   │   └── Dashboard.jsx    # Main dashboard
    │   ├── App.jsx              # Main app with routing
    │   └── main.jsx             # Entry point
    └── package.json
```

## Notes

- Make sure to update the MongoDB connection string in `backend/.env` before running the backend
- The backend uses CORS to allow requests from the frontend
- JWT tokens expire after 30 days
- All expense routes are protected and require authentication
