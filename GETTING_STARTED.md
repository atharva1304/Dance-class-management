# Getting Started Guide

## Quick Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
```

Configure MongoDB connection in `.env` file

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Database Setup

MongoDB should be running. Create the following collections:
- admins
- students
- expenses
- payments

### 4. First Admin User

Create an admin account through the registration endpoint or database directly.

### 5. Default Login Credentials

After setup, use the following routes:
- Admin Login: `http://localhost:5173/admin-login`
- Student Login: `http://localhost:5173/student-login`

## Troubleshooting

### Port Already in Use
Change the PORT in server `.env` or client `vite.config.js`

### MongoDB Connection Error
Ensure MongoDB is running:
- Local: `mongod` command
- Cloud: Check MongoDB Atlas connection string in `.env`

### CORS Issues
Check `CORS_ORIGIN` in server `.env` matches frontend URL

## Development Tips

- Use React DevTools browser extension for debugging
- Use MongoDB Compass for database visualization
- Check browser console for API errors
- Server logs show request/response details

## Next Steps

1. Implement student file upload functionality
2. Add email notification system
3. Create advanced reporting features
4. Add attendance tracking
5. Implement payment reminders
