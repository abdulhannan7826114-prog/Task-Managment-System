# Quick Start Guide

Get the Task Management App running in 5 minutes!

## Option 1: Local Development (Fastest)

### Prerequisites
- Node.js v18+
- MongoDB installed locally OR MongoDB Atlas account

### Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/task-management

# Start backend
npm run dev

# Backend running on http://localhost:5000
```

### Setup Frontend

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start frontend
npm run dev

# Frontend running on http://localhost:5173
```

### Test the App

1. Open http://localhost:5173
2. Register with email and password
3. Create and manage tasks!

---

## Option 2: Docker (Recommended)

### Prerequisites
- Docker Desktop installed

### Start Everything

```bash
# From project root
docker-compose up -d

# Wait for services to start (30 seconds)
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Stop Services

```bash
docker-compose down
```

---

## Option 3: Production Deployment

### Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Select `backend` directory
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection
   - `JWT_SECRET`: Generate a strong secret
6. Deploy

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Select `frontend` directory
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL
5. Deploy

---

## Run Tests

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

---

## Project Structure

```
task-management-app/
├── backend/                    # Node.js/Express API
│   ├── controllers/            # Business logic
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Auth, errors
│   ├── __tests__/              # Test files
│   └── server.js               # Entry point
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   ├── context/            # Context API
│   │   ├── utils/              # API client
│   │   └── styles/             # CSS files
│   └── vite.config.js
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│
├── docker-compose.yml          # Multi-container setup
├── README.md                   # Full documentation
├── TESTING.md                  # Testing guide
├── DEPLOYMENT.md               # Deployment guide
├── DOCKER.md                   # Docker guide
├── CI-CD.md                    # GitHub Actions guide
└── DATABASE_SCHEMA.md          # Database documentation
```

---

## Key Features

✅ **User Authentication**
- Register and login with JWT tokens
- Password hashing with bcrypt

✅ **Task Management**
- Create, read, update, delete tasks
- Filter by status and priority
- Set due dates

✅ **Responsive UI**
- Works on desktop and mobile
- Professional design
- Real-time updates

✅ **Production Ready**
- Docker support
- CI/CD pipeline
- Comprehensive tests
- Error handling
- Security best practices

---

## Common Commands

### Development

```bash
# Backend
npm run dev                 # Start dev server
npm test                    # Run tests
npm run lint                # Check code quality

# Frontend
npm run dev                 # Start dev server
npm test                    # Run tests
npm run build               # Build for production
```

### Docker

```bash
docker-compose up -d        # Start all services
docker-compose down         # Stop services
docker-compose logs -f      # View logs
```

---

## Environment Setup

### Backend .env

```
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### Frontend .env

```
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongosh

# Or use MongoDB Atlas connection string
```

### Tests Failing

```bash
# Clear cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose
```

### Frontend can't reach Backend

```
Check VITE_API_URL in .env
Ensure backend is running on correct port
Check CORS settings in backend
```

---

## Next Steps

1. **Read Full Documentation**
   - [README.md](README.md) - Complete overview
   - [TESTING.md](TESTING.md) - Testing strategies
   - [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Data models

2. **Deploy to Production**
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
   - Set up GitHub Actions
   - Configure CI/CD pipeline

3. **Scale the App**
   - Add more features
   - Optimize performance
   - Set up monitoring

4. **Learn More**
   - [MERN Stack Guide](https://www.mongodb.com/developer/languages/javascript/mern-stack-tutorial/)
   - [Express.js Documentation](https://expressjs.com/)
   - [React Documentation](https://react.dev/)

---

## Support

- 📖 Check [README.md](README.md) for detailed docs
- 🧪 See [TESTING.md](TESTING.md) for test examples
- 🐳 Visit [DOCKER.md](DOCKER.md) for Docker help
- 🚀 Read [CI-CD.md](CI-CD.md) for GitHub Actions

---

**Happy coding! 🎉**

Start with Docker Compose for the fastest setup, then explore the full documentation for more details.
