# Task Management Application

A full-stack **Task Management Platform** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.This project allows users to manage their daily tasks efficiently with authentication, dashboards, filters, and profile insights.

## Live Demo

**Frontend (Netlify):** [Live URL](https://fortask.netlify.app)
**Backend (Render):** [Live URL](https://task-manager-cak5.onrender.com)


## Features

### User Authentication
- Signup & Login using  **JWT-based authentication**.
- Each user can access **only their own tasks**.

### Task Management
- CRUD operations for tasks.
- Field include:
    - **Title**
    - **Description**
    - **Status** (Pending / In Progress / Completed)
    - **Due Date**
    - **Priority** (Low / Medium / High)

### Dashboard
- Displays all tasks with **filters by status, priority, and due date**.

### User Profile
- Shows user details and **task statistics and progress bar**:
    - Total tasks
    - Completed Tasks
    - Pending Tasks

## Bonus features
- Drag-and-drop task organization used **Hello pangea dnd**
- Email reminders for over due and upcoming tasks used **Brevo Email API**
- Chart for Pending, In Progress and Completed used **Nivo Charts**
- Dark mode toggle

## Tech Stack

**Frontend:** React.js, TailwindCSS, React Router, Context API
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Authentication:** JWT (JSON Web Token)
**Deployment:**
    - Frontend : Netlify
    - Backend : Render

## Installation & Setup Guide

git clone https://github.com/afsalboot/task-manager.git

cd task-manager

## Backend Setup

cd server

npm install

- Create .env file inside /server with:
    - PORT=5000
    - MONGO_URI=Your mongodb connection string
    - JWT_SECRET=Your JWT secret key
    - CLIENT_URL=Your client url
    - BREVO_API_KEY=Your brevo API key
    - EMAIL_SENDER=Your Email ID

npm run dev

## Frontend Setup

- Create .env file inside /client with:
    - VITE_BASE_URL=Your backend passed url

cd client

npm install

npm run dev

## Screenshots

**Login Page** ![alt text](</Sreenshots/Login Page.jpeg>)
**Signup Page:** ![alt text](</Sreenshots/Signup Page.jpeg>)
**Dashboard** ![alt text](/Sreenshots/Dashboard.jpeg)
**Profile Page** ![alt text](</Sreenshots/Profile Page.jpeg>)
**Create Task Page** ![alt text](</Sreenshots/Create Task Page.jpeg>)
**Dashboard after create task** ![alt text](</Sreenshots/Dashboard after create task.jpeg>)