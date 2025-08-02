# Learning Management System (LMS)

A full-stack course listing and student enrollment module built with React.js, Node.js, Express.js, and MongoDB.
## 🔗 Live Demo

**🌐 [View Live Application](https://lms-module.up.railway.app/)**

## Features

- **Course Listing**: Display all available courses with details
- **Student Enrollment**: Enroll/unenroll in courses with real-time status updates
- **Responsive UI**: Modern, clean interface built with React
- **RESTful API**: Complete backend API with Express.js
- **MongoDB Database**: Persistent data storage with MongoDB Atlas

## Project Structure

```
LMS/
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express.js backend API
└── README.md         # Project documentation
```

## Tech Stack

### Frontend
- React.js
- CSS3 with modern styling
- Fetch API for HTTP requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS for cross-origin requests

### Database
- MongoDB Atlas (cloud database)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Courses
- `GET /api/courses` - Get all available courses
- `GET /api/enrollments/me` - Get current student's enrollments
- `POST /api/enrollments` - Create new enrollment

## Deployment

### Frontend Deployment
- Deploy to Netlify, Vercel, or GitHub Pages
- Build command: `npm run build`

### Backend Deployment
- Deploy to Heroku, Render, or Railway
- Set environment variables for MongoDB connection

## Features Implemented

✅ Course listing with details (title, description, instructor, duration)
✅ Enrollment status indication
✅ Enroll/Unenroll functionality
✅ Responsive and modern UI
✅ Complete backend API
✅ MongoDB database integration
✅ Error handling
✅ Clean project structure

## Demo Student
The application uses a dummy student ID (`dummyStudent123`) for demonstration purposes. 
