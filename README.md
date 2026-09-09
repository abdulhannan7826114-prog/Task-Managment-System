# Task Management App - MERN Stack

A full-featured task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This is a production-ready application demonstrating modern full-stack development practices.

## 🎯 Features

✅ **User Authentication**
- Secure user registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes and API endpoints

✅ **Task Management (CRUD)**
- Create, read, update, and delete tasks
- Organize tasks by status (Todo, In Progress, Done)
- Prioritize tasks (Low, Medium, High)
- Set due dates for tasks

✅ **User Interface**
- Responsive and intuitive dashboard
- Real-time task filtering
- Statistics dashboard
- Professional UI/UX design

✅ **Security**
- JWT-based authentication
- Password encryption
- Protected API routes
- CORS configuration

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, Helmet.js

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/task-management
PORT=5000
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  status: String (Todo, In Progress, Done),
  priority: String (Low, Medium, High),
  dueDate: Date,
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is hashed using bcrypt
3. JWT token is generated and sent to client
4. Token is stored in localStorage
5. Token is sent with every API request in Authorization header
6. Server validates token and grants access to protected routes

## 📦 Project Structure

```
task-management-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   ├── task-form.css
│   │   │   ├── task-list.css
│   │   │   └── task-card.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Deploy Backend to Render
1. Push code to GitHub
2. Connect GitHub repo to Render
3. Set environment variables
4. Deploy

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables
4. Deploy

## 🔄 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📝 Notes

- Default JWT expiry is 7 days
- All passwords are hashed with bcrypt (10 salt rounds)
- CORS is configured for frontend communication
- Error handling is implemented at all levels
- Request logging is enabled for debugging

## 🎓 Learning Outcomes

By completing this project, you will learn:
- Full-stack development with MERN
- RESTful API design
- JWT authentication
- MongoDB database design
- React component architecture
- State management with Context API
- API integration with axios
- Responsive UI design
- Error handling and validation

## 📄 License

MIT

## 👤 Author

Muhammad Hanan
- GitHub: [@abdulhannan7826114-prog](https://github.com/abdulhannan7826114-prog)
- Email: [Your Email]

## 🤝 Contributing

Feel free to fork this project and submit pull requests!

## 📞 Support

For questions or issues, please open an issue in the GitHub repository.

---

**Happy Coding! 🚀**
