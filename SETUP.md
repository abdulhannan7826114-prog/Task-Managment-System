# Quick Setup Guide (5 Minutes)

## ⚡ Fast Track Setup

### 1️⃣ Backend (5 minutes)

```bash
# Navigate to backend
cd backend

# Install packages
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/task-management
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
EOF

# Start development server
npm run dev
# ✅ Backend running on http://localhost:5000
```

**Get MongoDB URI:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free tier)
4. Get connection string
5. Replace `YOUR_USERNAME:YOUR_PASSWORD` in .env

### 2️⃣ Frontend (5 minutes)

```bash
# In another terminal, navigate to frontend
cd frontend

# Install packages
npm install

# Start dev server
npm run dev
# ✅ Frontend running on http://localhost:3000
```

### 3️⃣ Test the App

1. Open http://localhost:3000
2. Click "Register"
3. Create account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Create a task
5. Test all features

---

## 🎯 What Each Command Does

### Backend Commands
```bash
npm install       # Install dependencies (run once)
npm run dev       # Start dev server with auto-reload
npm start         # Start production server
```

### Frontend Commands
```bash
npm install       # Install dependencies (run once)
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 🔑 Important Credentials

### Default Test User (after registration)
- Email: `test@example.com`
- Password: `password123`

### MongoDB Atlas
- Free tier: 512 MB storage
- No credit card required
- Valid for 3 months (auto-extends)

### JWT Token
- Stored in localStorage after login
- Valid for 7 days
- Sent in every API request header

---

## 📱 Test All Features

### Registration
1. Click "Register"
2. Fill form (username, email, password)
3. Click "Register"
4. Automatically logged in & redirected to dashboard

### Login
1. Click "Login"
2. Enter email & password
3. Click "Login"
4. See dashboard with your tasks

### Create Task
1. Click "+ Add New Task"
2. Fill title (required)
3. Add description (optional)
4. Select priority
5. Add due date (optional)
6. Click "Save Task"

### View Tasks
- Grouped by status: Todo, In Progress, Done
- Shows count of tasks in each column
- Tasks sorted by creation date (newest first)

### Update Task
1. Hover over task card
2. Click ✏️ (edit) button
3. Modify any field
4. Click "Save Task"

### Change Status
1. Click status dropdown on task card
2. Select new status (Todo → In Progress → Done)
3. Task moves to new column instantly

### Delete Task
1. Click 🗑️ (delete) button on task
2. Confirm deletion
3. Task removed from view

### Logout
1. Click "Logout" button
2. Redirected to login page
3. Token cleared from localStorage

---

## 🛠️ Troubleshooting

### "Cannot find module" Error

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Port Already in Use

```bash
# If port 5000 or 3000 is in use:
# Windows: Find and kill process
lsof -i :5000
kill -9 <PID>

# Or change port in .env or vite.config.js
```

### MongoDB Connection Error

```
"MongoNetworkError: getaddrinfo ENOTFOUND"
```

**Fix:**
1. Check MongoDB URI in .env
2. Verify username:password are correct
3. Check IP whitelist on MongoDB Atlas (add 0.0.0.0/0)
4. Ensure database exists

### CORS Error

```
"Access to XMLHttpRequest blocked by CORS policy"
```

**Fix:**
- Backend CORS is enabled by default
- If issue persists, restart backend: `npm run dev`

### Login Returns "Invalid credentials"

```
"Email or username already exists"
```

**Causes:**
1. Email already registered → Use different email
2. Username taken → Use different username

**Solution:** Register with new email/username or login with existing credentials

### Task Not Saving

1. Check network tab in DevTools
2. Verify authentication token exists
3. Check backend is running
4. Review error message

---

## 📊 API Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Select `postman-collection.json` from project root
4. Collection imported

### Test Endpoints

**Step 1: Register**
1. Go to "Authentication" → "Register"
2. Click "Send"
3. Copy token from response

**Step 2: Set Token**
1. Go to "Authorization" tab
2. Select "Bearer Token"
3. Paste token in input

**Step 3: Create Task**
1. Go to "Tasks" → "Create Task"
2. Click "Send"
3. See new task in response

**Step 4: Get All Tasks**
1. Go to "Tasks" → "Get All Tasks"
2. Click "Send"
3. See all your tasks

---

## 🚀 Next Steps

### When Ready to Deploy:
1. Read `DEPLOYMENT.md`
2. Push code to GitHub
3. Connect to Render (backend)
4. Connect to Vercel (frontend)
5. Share live links

### When Recording Demo:
1. Create fresh account for demo
2. Create 5-6 sample tasks
3. Show all CRUD operations
4. Show mobile responsiveness
5. Test on deployed version (if live)
6. Keep video under 5 minutes

---

## 💡 Tips & Tricks

### Speed Up Development
- Use VS Code REST Client to test API
- Keep browser DevTools open (Network tab)
- Use React DevTools extension
- Enable Fast Refresh in Vite

### Useful Browser Shortcuts
- F12: Open DevTools
- Ctrl+Shift+C: Inspect element
- Ctrl+K: Search in DevTools
- localStorage: Check auth token stored

### Development Workflow
1. Make code changes
2. Hot reload works automatically
3. Check console for errors
4. Test in browser
5. Repeat

---

## 🎓 Learning While Building

This project teaches:
- ✅ Full-stack development workflow
- ✅ REST API design & implementation
- ✅ Database schema design
- ✅ Authentication & security
- ✅ Frontend state management
- ✅ Component composition
- ✅ Form handling & validation
- ✅ Error handling
- ✅ Deployment & DevOps

---

## 📞 Need Help?

### Check Logs
```bash
# Terminal where backend runs
# Look for error messages

# Browser DevTools (F12)
# Check Console & Network tabs
```

### Common Issues
1. MongoDB URI incorrect → Check .env
2. Port in use → Kill process or change port
3. Module not found → `npm install`
4. API not responding → Restart backend

---

**You're all set! 🎉**

Start building amazing features on top of this foundation!

---
