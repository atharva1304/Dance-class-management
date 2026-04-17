# Quick Start: MySQL Migration

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Create MySQL Database
```bash
# Open MySQL CLI
mysql -u root -p

# Create database
CREATE DATABASE dance_class_db;
```

### Step 3: Configure Environment
Edit `server/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dance_class_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Step 4: Initialize Database
```bash
# Create tables and relationships
node scripts/initDatabase.js
```

### Step 5: Load Sample Data (Optional)
```bash
# Create sample admin, students, and expenses
node scripts/migrateData.js
```

### Step 6: Start Server
```bash
npm run dev
```

✅ Server running on `http://localhost:5000`

---

## 🧪 Test the API

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@danceschool.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Get All Students
```bash
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Troubleshooting

### MySQL Connection Error
**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:
1. Check if MySQL is running
2. Verify DB credentials in `.env`
3. Ensure database exists

### Port Already in Use
**Error**: `Error: listen EADDRINUSE :::5000`

**Solution**: Change PORT in `.env` or kill existing process

### Table Exists Error
**Error**: `ER_TABLE_EXISTS_ERROR`

**Solution**: 
- Drop tables: `DROP TABLE IF EXISTS Payments; DROP TABLE IF EXISTS Students;`
- Or modify `sequelize.sync({ alter: true })` in `db.js`

---

## 📊 Available API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/verify` - Verify token

### Students (All require JWT token)
- `GET /api/students` - List all
- `GET /api/students/:id` - Get one
- `POST /api/students` - Create
- `PUT /api/students/:id` - Update
- `DELETE /api/students/:id` - Delete

### Payments
- `GET /api/students/:id/payments` - Get payments
- `POST /api/students/:id/payments` - Add payment

### Expenses
- `GET /api/expenses` - List all
- `POST /api/expenses` - Create
- `PUT /api/expenses/:id` - Update
- `DELETE /api/expenses/:id` - Delete

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/revenue` - Revenue data
- `GET /api/analytics/expenses` - Expense data
- `GET /api/analytics/students` - Student stats

---

## 📝 Sample Data

If you ran the migration script, use these credentials:

**Admin**
- Email: `admin@danceschool.com`
- Password: `admin123`

**Student**
- Email: `student1@danceschool.com`
- Password: `student123`

---

## ✅ Validation Checklist

- [ ] MySQL installed and running
- [ ] Database `dance_class_db` created
- [ ] `.env` file configured
- [ ] `npm install` completed in server folder
- [ ] `node scripts/initDatabase.js` executed
- [ ] `npm run dev` starts without errors
- [ ] Health check responds (`/api/health`)
- [ ] Can login with sample credentials
- [ ] Frontend connects to backend

---

## 📚 Additional Resources

- [MYSQL_MIGRATION.md](../MYSQL_MIGRATION.md) - Detailed migration guide
- [Sequelize Docs](https://sequelize.org/)
- [MySQL Docs](https://dev.mysql.com/doc/)

---

## 🚀 Next Steps

1. **For Development**
   ```bash
   npm run dev  # Auto-reload on changes
   ```

2. **For Production**
   ```bash
   npm start    # Start server
   ```

3. **Connect Frontend**
   - Update frontend `.env` if needed
   - Frontend already configured for `http://localhost:5000`

---

## 📞 Support

**Common Issues?**
1. Check error messages in server console
2. Review `.env` configuration
3. Ensure MySQL is running
4. Check database credentials
5. Review logs in `MYSQL_MIGRATION.md`
