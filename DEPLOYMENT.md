# Deployment Guide

This guide covers deploying the Task Management App to various platforms.

## Prerequisites

- GitHub account
- Git CLI
- Node.js v14+
- MongoDB Atlas account (for cloud database)

## Local Development

### Using Docker Compose

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 3000

### Manual Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Update .env with your values
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Cloud Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set Build Command: `npm install`
6. Set Start Command: `node server.js`
7. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong secret key
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Your frontend URL
8. Deploy

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Select `frontend` as root directory
5. Add Environment Variable:
   - `VITE_API_URL`: Your backend API URL
6. Deploy

### Deploy Backend to Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new Project
4. Add MongoDB plugin
5. Add GitHub repo
6. Set Build Command: `npm install`
7. Set Start Command: `node server.js`
8. Add Environment Variables from `.env.example`
9. Deploy

## MongoDB Atlas Setup

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create free account
3. Create new cluster
4. Whitelist your IP or allow all IPs
5. Create database user
6. Get connection string
7. Use in `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management?retryWrites=true&w=majority
   ```

## Environment Variables

### Backend Production
```
MONGODB_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=your-very-secure-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend Production
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Health Check

Test deployment:

```bash
# Check backend
curl https://your-backend-url/api/health

# Check frontend
# Visit https://your-frontend-url
```

## Monitoring

### Render Dashboard
- View logs
- Monitor performance
- Restart service if needed

### Vercel Dashboard
- View deployments
- Check analytics
- Monitor errors

### Railway Dashboard
- View logs
- Monitor resource usage
- Environment management

## Troubleshooting

### Backend Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas whitelist
- Verify JWT_SECRET is set
- Check CORS is configured

### Frontend Connection Issues
- Verify VITE_API_URL is correct
- Check browser console for errors
- Verify backend is running
- Check CORS headers

### Token Expiry
- Tokens expire after 7 days
- User must log in again
- Consider implementing refresh tokens

## Continuous Deployment

GitHub Actions workflows in `.github/workflows/` automatically:
- Run tests on push
- Build frontend
- Deploy to production (can be configured)

## Scaling Considerations

- Use MongoDB Atlas for scalability
- Enable caching on frontend
- Use CDN for static files
- Monitor database performance
- Consider database indexing

## Backup & Recovery

### MongoDB Backup
- Enable automated backups in MongoDB Atlas
- Set retention period to 7-30 days
- Test restore procedures

### Code Backup
- GitHub handles code backups
- Use GitHub releases for versions

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] MONGODB_URI is not exposed
- [ ] CORS is properly configured
- [ ] HTTPS is enabled
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] Environment variables are not committed

## Performance Optimization

1. **Frontend**
   - Build with Vite for smaller bundle
   - Enable gzip compression
   - Use CDN for assets

2. **Backend**
   - Add database indexes
   - Implement caching
   - Optimize API queries

3. **Database**
   - Monitor slow queries
   - Optimize indexes
   - Archive old data

## Cost Estimation

### Free Tier
- Render: ~$7/month (after free tier)
- Vercel: Free
- MongoDB Atlas: Free (512MB)
- **Total**: ~$7/month

### Production
- Render: $15-50/month
- Vercel: $20/month
- MongoDB Atlas: $15-100/month
- **Total**: $50-170/month

---

For more help, check platform-specific documentation.
