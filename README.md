# Task Manager Application

A full-stack task management application built with Next.js, Express, and MongoDB. This application allows users to create, manage, and track tasks with features like task assignment, priority levels, and status tracking.

## Color Palette

The application uses a carefully selected color scheme:
- Deep Purple: `#210F37` - Primary color for main elements
- Purple: `#4F1C51` - Secondary color for interactive elements
- Terracotta: `#A55B4B` - Accent color for important actions
- Gold: `#DCA06D` - Background and secondary elements

## Features

### User Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt
- Role-Based Access Control (RBAC) with Admin, Manager, and Regular User roles

### Task Management
- Create, read, update, and delete tasks
- Task attributes:
  - Title
  - Description
  - Due date
  - Priority (High, Medium, Low)
  - Status (To Do, In Progress, Completed)
- Mobile-responsive design
- Real-time updates
- Recurring tasks (daily, weekly, monthly)
- Audit logging for all task actions

### Dashboard
- Overview of all tasks
- Task filtering and sorting
- Quick task creation
- Task status visualization
- Analytics dashboard with:
  - Task completion rates
  - Overdue task trends
  - User performance metrics
  - Team productivity insights

### Notifications
- Real-time notifications using WebSocket
- Customizable notification preferences
- Email notifications for important updates
- In-app alerts for task assignments and updates

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Axios for API calls
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Sahilr2501/task-management.git
cd task-manager
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd task-manager-frontend
npm install

# Install backend dependencies
cd ../task-manager-backend
npm install
```

3. Set up environment variables:
```bash
# In task-manager-frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000

# In task-manager-backend/.env
PORT=5000
MONGODB_URI=your_mongodb_uri
```

4. Start the development servers:
```bash
# Start backend server
cd task-manager-backend
npm run dev

# Start frontend server
cd ../task-manager-frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop screens

## Security Features

- Password hashing
- JWT token authentication
- Protected API endpoints
- Input validation
- XSS protection
- CORS configuration

## Testing

To run tests:
```bash
# Frontend tests
cd task-manager-frontend
npm test

# Backend tests
cd task-manager-backend
npm test
```

## Project Structure

```
task-manager/
├── task-manager-frontend/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── TaskCard.js
│   │   └── TaskForm.js
│   ├── pages/
│   │   ├── dashboard.js
│   │   ├── login.js
│   │   └── signup.js
│   ├── services/
│   │   ├── api.js
│   │   └── taskService.js
│   └── context/
│       └── AuthContext.js
└── task-manager-backend/
    ├── controllers/
    │   ├── taskController.js
    │   └── userController.js
    ├── models/
    │   ├── Task.js
    │   └── User.js
    ├── routes/
    │   ├── taskRoutes.js
    │   └── userRoutes.js
    └── middleware/
        └── auth.js
```

## Authors

- Sahil Mondal - Full-stack development, UI/UX design, and implementation of:
  - User authentication system
  - Task management features
  - Responsive dashboard
  - Color scheme and styling
  - API integration
  - Mobile-first design approach

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database solution 
