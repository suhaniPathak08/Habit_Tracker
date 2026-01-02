
# Habit Tracker Application

A full-stack Habit Tracker application designed to help users build consistency and achieve personal goals by tracking daily habits, maintaining streaks, and visualizing progress through charts.

The project consists of a **React (Vite) frontend** and a **Node.js + Express backend**, connected using REST APIs.


## 📁 Project Structure

my-habit-app/
│
├── frontend/ # React + Vite + Bootstrap frontend
├── server/ # Node.js + Express backend
└── README.md


## 🚀 Features

### 🔐 Authentication
- User signup and login using email & password
- JWT-based authentication
- Protected routes for authenticated users

### 📝 Habit Management
- Create new habits
- Edit existing habits
- Delete habits
- Mark habits as completed for a specific day

### 🔥 Streak Tracking
- Displays current streak for each habit
- Tracks best (longest) streak achieved

### 📊 Progress Visualization
- Bar chart showing habit completion over time
- Toggle between last 7 days and last 30 days

### 🎨 User Interface
- Responsive UI using Bootstrap 5
- Clean and simple layout
- Beginner-friendly and readable codebase


## 🛠 Tech Stack

### Frontend
- React (Vite)
- JavaScript
- Bootstrap
- Chart.js
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt for password hashing
- CORS-enabled REST API


## ⚙️ Installation & Setup


### 1️⃣ Backend Setup 
```
cd server
npm install
npm run dev   # or npm start

Backend runs at:
http://localhost:4000
```

2️⃣ Frontend Setup
```
cd frontend
npm install
Create a .env file inside the frontend folder:
VITE_API_BASE_URL=http://localhost:4000/api
Start the frontend:
npm run dev

Frontend runs at:
http://localhost:5173
```

🔗 Frontend–Backend Connection
•	All frontend API calls use:
•	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
•	JWT token is stored in localStorage after login
•	Protected requests include the header:
•	Authorization: Bearer <token>
•	Backend CORS allows requests from:
•	http://localhost:5173


🧪 How to Use
1.	Start the backend server
2.	Start the frontend server
3.	Open http://localhost:5173
4.	Sign up using a valid email
5.	Log in to your account
6.	Add habits and manage them
7.	Mark habits as completed
8.	Track streaks and view progress charts


📌 API Endpoints
Authentication
•	POST /api/auth/signup
•	POST /api/auth/login
Habits
•	GET /api/habits
•	POST /api/habits
•	PUT /api/habits/:id
•	DELETE /api/habits/:id
•	POST /api/habits/:id/toggle



