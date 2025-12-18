# ToDo Manager - Full Stack Task Tracking App

A modern, full-stack task management application built with React, Node.js, Express, and MongoDB. Features JWT authentication, CRUD operations, priority tagging, status tracking, and reminders with a beautiful dark-themed UI.

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **Task Management**: Full CRUD operations for tasks
- **Priority Tagging**: Categorize tasks as High, Medium, or Low priority
- **Status Tracking**: Track tasks through Pending, In Progress, and Completed states
- **Reminders**: Set reminder dates for important tasks
- **Filtering & Sorting**: Filter by status/priority and sort by date/priority
- **Responsive Design**: Beautiful glassmorphic UI that works on all devices
- **Real-time Updates**: Instant UI updates for all task operations

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Axios
- CSS3 with custom properties
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
cd "todo app"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2025
NODE_ENV=development
```

**For MongoDB Atlas**: Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app?retryWrites=true&w=majority
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB (if using local installation)

```bash
mongod
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173 (or http://localhost:5174)
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all user tasks (supports filtering and sorting)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Query Parameters for GET /api/tasks
- `status` - Filter by status (Pending, In Progress, Completed)
- `priority` - Filter by priority (Low, Medium, High)
- `sortBy` - Sort by field (createdAt, dueDate, priority)

## 🎨 Design Features

- **Dark Theme**: Modern dark color scheme with vibrant gradients
- **Glassmorphism**: Frosted glass effect on cards and modals
- **Smooth Animations**: Micro-animations for enhanced UX
- **Color-Coded Priorities**: 
  - High: Red gradient
  - Medium: Orange gradient
  - Low: Green gradient
- **Status Indicators**: Visual badges for task status
- **Responsive Grid**: Adapts to all screen sizes

## 📱 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Tasks**: Click "New Task" to add a task with title, description, priority, status, due date, and reminder
3. **Manage Tasks**: Edit, delete, or change status directly from task cards
4. **Filter & Sort**: Use the controls to filter by status/priority and sort tasks
5. **Track Progress**: View statistics dashboard showing total, pending, in progress, and completed tasks

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for secure authentication
- Protected API routes
- Input validation on both frontend and backend

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ using React, Node.js, Express, and MongoDB
# todo
