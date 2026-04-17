# Troubleshooting Guide - MongoDB to MySQL Migration

This guide covers common issues and solutions encountered during the migration process.

---

## 🔧 Installation Issues

### Issue: npm install fails with peer dependency errors

**Symptoms**:
```
npm ERR! found 0 vulnerabilities, but couldn't install peer dependencies
```

**Cause**: Node version incompatibility or missing peer dependencies

**Solutions**:
```bash
# 1. Try legacy peer deps flag
npm install --legacy-peer-deps

# 2. Update npm and node
npm update -g npm
node --version  # Should be 16.x or higher

# 3. Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: MySQL2 native bindings fail to install

**Symptoms**:
```
gyp ERR! build error
gyp ERR! stack Error: python not found
```

**Cause**: Missing build tools (Python, C++ compiler)

**Solutions**:

**Windows**:
```bash
# Install Windows Build Tools
npm install --global windows-build-tools

# Or install Visual Studio Community with C++ tools
```

**macOS**:
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

**Linux**:
```bash
# Ubuntu/Debian
sudo apt-get install build-essential python3

# CentOS/RHEL
sudo yum install gcc g++ make python
```

---

## 📊 Database Connection Issues

### Issue: Error: connect ECONNREFUSED 127.0.0.1:3306

**Symptoms**:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Cause**: MySQL server not running or not accessible

**Solutions**:

**1. Check if MySQL is running**:
```bash
# Windows
# Check Services or use Task Manager

# macOS
brew services list | grep mysql

# Linux
sudo systemctl status mysql
```

**2. Start MySQL**:
```bash
# Windows (as Administrator)
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

**3. Verify connection with CLI**:
```bash
# Test connection
mysql -h localhost -u root -p
# Enter your password when prompted

# Should show: mysql>
```

**4. Check .env configuration**:
```env
DB_HOST=localhost      # Not 127.0.0.1 if using socket
DB_PORT=3306
DB_NAME=dance_class_db
DB_USER=root
DB_PASSWORD=your_actual_password
```

### Issue: Error: Access denied for user 'root'@'localhost'

**Symptoms**:
```
Error: Access denied for user 'root'@'localhost' (using password: YES)
```

**Cause**: Wrong password or user doesn't exist

**Solutions**:

**1. Reset MySQL root password**:
```bash
# Windows - Stop MySQL first
net stop MySQL80

# Start with skip-grant
mysqld --skip-grant-tables

# In another terminal
mysql -u root

# Set new password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
EXIT;

# Restart MySQL normally
```

**2. Verify user exists**:
```bash
mysql -u root -p
SELECT user, host FROM mysql.user;
EXIT;
```

**3. Update .env with correct password**:
```env
DB_PASSWORD=your_actual_password  # Or empty if no password set
```

### Issue: Error: ER_BAD_DB_ERROR: Unknown database 'dance_class_db'

**Symptoms**:
```
ER_BAD_DB_ERROR: Unknown database 'dance_class_db'
```

**Cause**: Database doesn't exist yet

**Solutions**:

**1. Create database**:
```bash
mysql -u root -p
CREATE DATABASE dance_class_db;
EXIT;
```

**2. Or let Sequelize create it** (configure in db.js):
```javascript
// Add this to db.js
await sequelize.query('CREATE DATABASE IF NOT EXISTS dance_class_db')
```

**3. Verify database exists**:
```bash
mysql -u root -p
SHOW DATABASES;
# Should list: dance_class_db
EXIT;
```

---

## 🚀 Server Startup Issues

### Issue: Error: listen EADDRINUSE :::5000

**Symptoms**:
```
Error: listen EADDRINUSE :::5000
```

**Cause**: Port 5000 already in use

**Solutions**:

**1. Change port in .env**:
```env
PORT=5001  # Or any other available port
```

**2. Kill existing process**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: TypeError: Cannot read property 'authenticate' of undefined

**Symptoms**:
```
TypeError: Cannot read property 'authenticate' of undefined
```

**Cause**: Database connection not established

**Solutions**:

**1. Check db.js exports**:
```javascript
// db.js should export:
export const connectDB = async () => { ... }
export default sequelize
```

**2. Check server.js imports**:
```javascript
import { connectDB } from './config/db.js'
// Then call in main()
await connectDB()
```

**3. Ensure models are imported before connecting**:
```javascript
// server.js
import Admin from './models/Admin.js'
import Student from './models/Student.js'
import Payment from './models/Payment.js'
import Expense from './models/Expense.js'
import setupAssociations from './models/index.js'

setupAssociations()
await connectDB()
```

### Issue: ER_NO_DEFAULT_FOR_FIELD: Field 'X' doesn't have a default value

**Symptoms**:
```
ER_NO_DEFAULT_FOR_FIELD: Field 'email' doesn't have a default value
```

**Cause**: Creating record without required fields

**Solutions**:

**1. Check model definition**:
```javascript
email: {
  type: DataTypes.STRING(255),
  allowNull: false,  // ← Must provide value
  unique: true,
}
```

**2. Provide value or set default**:
```javascript
email: {
  type: DataTypes.STRING(255),
  allowNull: false,
  defaultValue: 'default@example.com',  // Add default
  unique: true,
}
```

**3. Always provide required fields when creating**:
```javascript
await Student.create({
  email: 'student@example.com',  // ← Provide all required fields
  password: 'hashed_password',
  name: 'Student Name',
})
```

---

## 🔄 Data Migration Issues

### Issue: Script fails: Cannot read property 'create' of undefined

**Symptoms**:
```
TypeError: Cannot read property 'create' of undefined
```

**Cause**: Models not imported correctly in migration script

**Solutions**:

**1. Check imports in migrateData.js**:
```javascript
import Admin from '../models/Admin.js'
import Student from '../models/Student.js'
import Payment from '../models/Payment.js'
import Expense from '../models/Expense.js'
import { connectDB } from '../config/db.js'

// Call connectDB first
await connectDB()
```

**2. Verify models are exported**:
```javascript
// Each model file should have:
export default Admin  // Or Student, Payment, Expense
```

### Issue: Script runs but no data appears in database

**Symptoms**:
```
✅ Created 1 sample admin
(but data not in database)
```

**Cause**: Transaction not committed or wrong database

**Solutions**:

**1. Verify correct database**:
```bash
mysql -u root -p dance_class_db
SELECT * FROM admins;
```

**2. Check if script actually connects**:
```javascript
// Add logging
console.log('Connecting to:', process.env.DB_NAME)
await connectDB()
console.log('Connected successfully')
```

**3. Ensure sequelize.sync() runs before data insert**:
```javascript
async function migrateData() {
  await connectDB()  // Creates tables
  // Then insert data
  await Admin.create(...)
}
```

---

## 📝 Query Execution Issues

### Issue: ER_SYNTAX_ERROR: You have an error in your SQL syntax

**Symptoms**:
```
ER_SYNTAX_ERROR: You have an error in your SQL syntax near...
```

**Cause**: Invalid query syntax from Sequelize

**Solutions**:

**1. Enable logging to see SQL**:
```javascript
// In db.js
const sequelize = new Sequelize(dbName, user, password, {
  logging: console.log,  // Log all queries
})
```

**2. Check query operator usage**:
```javascript
// Wrong:
Student.findAll({ email: 'test@example.com' })

// Correct:
Student.findAll({ where: { email: 'test@example.com' } })
```

**3. Verify Op operators**:
```javascript
import { Op } from 'sequelize'

// Wrong:
{ $or: [...] }

// Correct:
{ [Op.or]: [...] }
```

### Issue: ER_BAD_FIELD_ERROR: Unknown column 'X' in 'where clause'

**Symptoms**:
```
ER_BAD_FIELD_ERROR: Unknown column 'studentId' in 'where clause'
```

**Cause**: Column name mismatch or typo

**Solutions**:

**1. Check model field definition**:
```javascript
// If defined as:
studentId: DataTypes.INTEGER

// Query must use exact name:
where: { studentId: 123 }  // Not student_id
```

**2. Check database table**:
```bash
mysql -u root -p dance_class_db
DESCRIBE payments;
```

**3. Use correct case (Sequelize is case-sensitive)**:
```javascript
// If model has: camelCase
firstName: DataTypes.STRING

// Query uses: camelCase
where: { firstName: 'John' }
```

### Issue: ER_DUP_ENTRY: Duplicate entry 'test@example.com'

**Symptoms**:
```
ER_DUP_ENTRY: Duplicate entry 'test@example.com' for key 'email'
```

**Cause**: Unique constraint violation

**Solutions**:

**1. Clear duplicate data**:
```bash
mysql -u root -p dance_class_db
DELETE FROM students WHERE email = 'test@example.com';
```

**2. Check for unique constraint**:
```bash
SHOW CREATE TABLE students;
```

**3. Update instead of create**:
```javascript
const [student] = await Student.findOrCreate({
  where: { email: 'test@example.com' },
  defaults: { password: 'hashed' }
})
```

---

## 🔐 Authentication Issues

### Issue: JWT token fails verification

**Symptoms**:
```
JsonWebTokenError: invalid token
```

**Cause**: User ID format changed (ObjectId → INTEGER)

**Solutions**:

**1. Ensure JWT uses correct ID**:
```javascript
// Before (MongoDB ObjectId):
const token = jwt.sign({ id: user._id }, secret)

// After (MySQL INTEGER):
const token = jwt.sign({ id: user.id }, secret)
```

**2. Clear old tokens** (they won't work with new format)

**3. Re-login to get new token**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@danceschool.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Issue: Cannot login with migrated credentials

**Symptoms**:
```
Invalid credentials
```

**Cause**: Password hashing changed or wrong plaintext password

**Solutions**:

**1. Verify password hashing hook**:
```javascript
// Model must have:
hooks: {
  beforeSave: async (admin) => {
    if (admin.changed('password')) {
      admin.password = await bcrypt.hash(admin.password, 10)
    }
  }
}
```

**2. Reset password in database**:
```bash
mysql -u root -p dance_class_db

# Delete and recreate user
DELETE FROM students WHERE email = 'student@example.com';
# Then create via API or script
```

**3. Test with script credentials**:
```
Email: admin@danceschool.com
Password: admin123
```

---

## 📊 Analytics Issues

### Issue: Analytics returns NULL or 0

**Symptoms**:
```json
{
  "totalRevenue": 0,
  "totalExpenses": 0
}
```

**Cause**: Query doesn't match data or aggregation issue

**Solutions**:

**1. Check raw data exists**:
```bash
mysql -u root -p dance_class_db
SELECT COUNT(*) FROM payments WHERE status = 'completed';
SELECT * FROM expenses;
```

**2. Enable query logging**:
```javascript
const sequelize = new Sequelize(..., { logging: console.log })
```

**3. Verify aggregation syntax**:
```javascript
// Check for parseFloat wrapper:
const result = await Expense.findAll({
  attributes: [[fn('SUM', col('amount')), 'total']],
  raw: true
})
const total = parseFloat(result[0]?.total) || 0  // ← Important
```

### Issue: GROUP BY query fails

**Symptoms**:
```
ER_WRONG_FIELD_IN_GROUP_BY: Expression #1 of SELECT list is not in GROUP BY clause
```

**Cause**: MySQL strict GROUP BY rules

**Solutions**:

**1. Use ONLY_FULL_GROUP_BY mode** (or disable it):
```sql
SET sql_mode = '';
```

**2. Fix query to include all non-aggregated fields in GROUP BY**:
```javascript
// All selected fields must be in group or aggregated
const stats = await Student.findAll({
  attributes: [
    'status',
    [fn('COUNT', col('id')), 'count']
  ],
  group: ['status'],  // ← Must include all non-aggregated fields
  raw: true
})
```

---

## 🧪 Testing Issues

### Issue: Frontend can't connect to backend

**Symptoms**:
```
CORS error or 
Connection refused
```

**Cause**: Backend not running or wrong port

**Solutions**:

**1. Start backend**:
```bash
cd server
npm run dev
# Should show: Server running on port 5000
```

**2. Check CORS configuration**:
```env
CORS_ORIGIN=http://localhost:5173  # Frontend port
```

**3. Update frontend API URL**:
```javascript
// In frontend .env or config
VITE_API_URL=http://localhost:5000
```

**4. Test API directly**:
```bash
curl http://localhost:5000/api/health
# Should get response
```

### Issue: Routes return 404

**Symptoms**:
```
404 Not Found
```

**Cause**: Routes not registered or typo

**Solutions**:

**1. Check route registration in server.js**:
```javascript
app.use('/api/students', studentRouter)
app.use('/api/expenses', expenseRouter)
```

**2. Verify exact path**:
```bash
# If route is /api/students
curl http://localhost:5000/api/students

# Not:
curl http://localhost:5000/api/student
```

**3. Check route file exports**:
```javascript
// Each router file should export:
export default router
```

---

## 🔍 Debugging Tips

### Enable Detailed Logging

```javascript
// In db.js
import sequelize from './config/db.js'

// Log all queries
sequelize.on('query', (query) => {
  console.log('SQL Query:', query.sql)
  console.log('Bindings:', query.bind)
})
```

### Check Database State

```bash
mysql -u root -p dance_class_db

# View all tables
SHOW TABLES;

# Describe table structure
DESCRIBE students;

# Count records
SELECT COUNT(*) FROM students;

# View sample data
SELECT * FROM students LIMIT 5;
```

### Test Query Manually

```bash
mysql -u root -p dance_class_db

# Test a query that's failing in app
SELECT * FROM students WHERE status = 'active';

# Check if columns exist
SHOW COLUMNS FROM students;
```

### Use Node Debugger

```bash
# Run with inspector
node --inspect scripts/migrateData.js

# Open: chrome://inspect
```

---

## 📞 Getting Help

### Check These First:
1. ✅ MySQL is running
2. ✅ Database exists and is configured
3. ✅ .env file has correct credentials
4. ✅ All dependencies installed (npm install)
5. ✅ No typos in queries or field names

### Useful Commands:

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MySQL version
mysql --version

# List MySQL processes
ps aux | grep mysql

# Test connection
mysql -h localhost -u root -p dance_class_db -e "SELECT 1"

# View server logs
npm run dev 2>&1 | tee server.log
```

### Contact Support:
- Check [MYSQL_MIGRATION.md](./MYSQL_MIGRATION.md) for detailed reference
- Review [CODE_CHANGES_REFERENCE.md](./CODE_CHANGES_REFERENCE.md) for examples
- Check [QUICKSTART_MYSQL.md](./QUICKSTART_MYSQL.md) for setup guide

---

## ✅ Validation Checklist

Before declaring migration successful:

- [ ] MySQL runs without errors
- [ ] Database created and selected
- [ ] Tables created with correct structure
- [ ] Sample data inserted successfully
- [ ] Admin login works
- [ ] Student login works
- [ ] Analytics dashboard loads
- [ ] Payment recording works
- [ ] Expense tracking works
- [ ] Date filters work
- [ ] Search functionality works
- [ ] Frontend connects to backend
- [ ] No CORS errors
- [ ] All API endpoints respond
- [ ] No 404 or 500 errors

---

## 🎉 Success!

If you've resolved all issues and passed the checklist, your MySQL migration is complete! 🚀

For additional support, refer to:
- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance/)
