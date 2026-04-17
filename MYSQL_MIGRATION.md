# MongoDB to MySQL Migration Guide

This guide provides all the necessary information to migrate from MongoDB to MySQL using Sequelize ORM.

## Changes Made

### 1. **Dependencies Updated**
```bash
# Removed
mongoose (MongoDB ORM)

# Added  
sequelize (SQL ORM)
mysql2 (MySQL driver for Node.js)
```

### 2. **Database Configuration**
**File**: `server/config/db.js`

Converted from MongoDB connection to MySQL:
```javascript
// Old: MongoDB connection
mongoose.connect('mongodb://...')

// New: Sequelize + MySQL connection
new Sequelize(database, user, password, {
  host: 'localhost',
  dialect: 'mysql'
})
```

### 3. **Environment Variables**
**File**: `server/.env`

Updated from MongoDB URI to MySQL connection details:
```env
# Old
MONGODB_URI=mongodb://localhost:27017/dance-class

# New
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dance_class_db
DB_USER=root
DB_PASSWORD=
```

### 4. **Models Converted to Sequelize**

#### **Admin Model** (`server/models/Admin.js`)
- Sequelize DataTypes: VARCHAR(255), BOOLEAN, ENUM
- Password hashing using beforeSave hook
- Instance method: `comparePassword()`

#### **Student Model** (`server/models/Student.js`)
- Sequelize DataTypes: INTEGER, STRING, DECIMAL, DATE, ENUM
- Indexes on: email (unique), status, createdAt
- Relationships: One-to-Many with Payment model

#### **Payment Model** (`server/models/Payment.js`)
- Foreign Key relationship to Student (studentId)
- Cascade delete via Sequelize relationship
- Indexes on: studentId, status, date

#### **Expense Model** (`server/models/Expense.js`)
- JSON field for attachments (array)
- Indexes on: category, date

### 5. **Controllers Updated**

#### **Authentication Controller** (`server/controllers/authController.js`)
- `findOne({ where: { email } })` instead of `findOne({ email })`
- `findOne()` for Sequelize instead of MongoDB queries
- `user.id` instead of `user._id`

#### **Student Controller** (`server/controllers/studentController.js`)
- `Sequelize.Op.or` for OR queries
- `Sequelize.Op.like` for LIKE pattern matching
- `findByPk()` for finding by primary key
- `.increment()` for atomic updates

#### **Expense Controller** (`server/controllers/expenseController.js`)
- `Op.gte`, `Op.lte` for date range queries
- `findAll()` with where conditions

#### **Analytics Controller** (`server/controllers/analyticsController.js`)
- `sequelize.fn('SUM', sequelize.col('amount'))` for aggregate functions
- `sequelize.fn('COUNT', sequelize.col('id'))` for counting
- `.group` for GROUP BY queries
- Raw results formatted to match previous API response

### 6. **Services Updated**

#### **Student Service** (`server/services/studentService.js`)
- Sequelize eager loading: `findByPk(id, { include: 'payments' })`
- Direct `totalPaid` field instead of calculating from payments

#### **Expense Service** (`server/services/expenseService.js`)
- SQL aggregation functions
- Date range filtering with `Op.gte` and `Op.lte`

#### **Analytics Service** (`server/services/analyticsService.js`)
- SQL SUM/COUNT instead of MongoDB aggregation pipeline
- Proper date handling for monthly summaries

## Installation & Setup

### Prerequisites
- MySQL Server installed and running
- Node.js v14+ 
- npm package manager

### Step 1: Install Dependencies

```bash
cd server
npm install
```

This will install:
- `sequelize` - SQL ORM
- `mysql2` - MySQL driver

### Step 2: Create MySQL Database

Open MySQL and run:
```sql
CREATE DATABASE dance_class_db;
```

### Step 3: Configure Environment Variables

Edit `server/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dance_class_db
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Step 4: Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will automatically:
1. Connect to MySQL
2. Create all tables (Sequelize sync)
3. Setup relationships
4. Start listening on port 5000

## Database Schema

### Admin Table
```sql
CREATE TABLE `Admins` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `phone` VARCHAR(20),
  `role` ENUM('admin', 'superadmin') DEFAULT 'admin',
  `isActive` BOOLEAN DEFAULT true,
  `createdAt` TIMESTAMP,
  `updatedAt` TIMESTAMP
);
```

### Student Table
```sql
CREATE TABLE `Students` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255),
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `address` TEXT,
  `danceType` VARCHAR(255),
  `level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `batchTiming` VARCHAR(255),
  `feeAmount` DECIMAL(10,2) DEFAULT 0,
  `feeFrequency` ENUM('monthly', 'quarterly', 'yearly') DEFAULT 'monthly',
  `status` ENUM('active', 'inactive', 'graduated', 'suspended') DEFAULT 'active',
  `joinDate` DATE,
  `lastPaymentDate` DATE,
  `totalPaid` DECIMAL(10,2) DEFAULT 0,
  `createdAt` TIMESTAMP,
  `updatedAt` TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_createdAt` (`createdAt`)
);
```

### Payment Table
```sql
CREATE TABLE `Payments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `studentId` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `month` VARCHAR(50),
  `paymentMethod` ENUM('cash', 'bank', 'upi', 'check', 'online') DEFAULT 'cash',
  `transactionId` VARCHAR(255),
  `status` ENUM('completed', 'pending', 'cancelled', 'refunded') DEFAULT 'completed',
  `notes` TEXT,
  `createdAt` TIMESTAMP,
  `updatedAt` TIMESTAMP,
  FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE CASCADE,
  INDEX `idx_studentId` (`studentId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_date` (`date`)
);
```

### Expense Table
```sql
CREATE TABLE `Expenses` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `category` ENUM('rent', 'utilities', 'equipment', 'maintenance', 'salary', 'other') NOT NULL,
  `description` TEXT,
  `amount` DECIMAL(10,2) NOT NULL,
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `paymentMethod` ENUM('cash', 'bank', 'upi', 'cheque'),
  `referenceNumber` VARCHAR(255),
  `notes` TEXT,
  `attachments` JSON DEFAULT '[]',
  `createdAt` TIMESTAMP,
  `updatedAt` TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_date` (`date`)
);
```

## API Endpoints (Unchanged)

All API endpoints remain the same. The only change is the internal database implementation.

### Authentication
- `POST /api/auth/login` ✓
- `POST /api/auth/register` ✓
- `GET /api/auth/verify` ✓
- `POST /api/auth/logout` ✓

### Students
- `GET /api/students` ✓
- `GET /api/students/:id` ✓
- `POST /api/students` ✓
- `PUT /api/students/:id` ✓
- `DELETE /api/students/:id` ✓
- `GET /api/students/:id/payments` ✓
- `POST /api/students/:id/payments` ✓

### Expenses
- `GET /api/expenses` ✓
- `POST /api/expenses` ✓
- `PUT /api/expenses/:id` ✓
- `DELETE /api/expenses/:id` ✓

### Analytics
- `GET /api/analytics/dashboard` ✓
- `GET /api/analytics/revenue` ✓
- `GET /api/analytics/expenses` ✓
- `GET /api/analytics/students` ✓
- `GET /api/analytics/payments` ✓

## Migration from MongoDB

If you have existing MongoDB data:

### 1. Export MongoDB Data
```bash
# Export collections to JSON
mongodump --db dance-class --out ./dump
```

### 2. Convert and Import to MySQL
You can use third-party tools or write a Node.js migration script to convert and insert data into MySQL.

### 3. Update IDs
MongoDB uses ObjectId, MySQL uses INTEGER. You may need to:
- Create a mapping of old ObjectIds to new IDs
- Update foreign key references

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL server is running
```bash
# Start MySQL (Windows)
mysql -u root -p

# Or restart MySQL service
```

### Table Already Exists
```
Error: ER_TABLE_EXISTS_ERROR
```
**Solution**: Set `alter: false` in `sequelize.sync()` if you want to skip synchronization, or drop tables manually:
```sql
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Expenses;
DROP TABLE IF EXISTS Admins;
```

### Authentication Errors
If you face password comparison errors:
1. Clear the `Students` table data
2. Re-register students through the API
3. MySQL uses proper password hashing via bcryptjs

## Performance Tips

### 1. Add More Indexes
For frequently searched fields:
```javascript
indexes: [
  { fields: ['email'] },
  { fields: ['status', 'createdAt'] }
]
```

### 2. Connection Pooling
Adjust pool settings in `db.js`:
```javascript
pool: {
  max: 10,      // Max connections
  min: 2,       // Min connections
  idle: 10000   // Idle timeout
}
```

### 3. Query Optimization
Use Sequelize raw queries for complex operations:
```javascript
sequelize.query('SELECT ...', { raw: true })
```

## Frontend Changes

**No changes required!** The frontend continues to work as before since all API endpoints return the same response format.

## Validation Checklist

- [ ] MySQL database created
- [ ] `.env` file configured with MySQL credentials
- [ ] `npm install` completed
- [ ] Server starts without errors
- [ ] All tables created automatically
- [ ] `/api/health` endpoint responds
- [ ] Admin login works
- [ ] Student registration works
- [ ] Student payments recorded correctly
- [ ] Analytics queries return correct totals
- [ ] Expense categories display properly

## Support & Questions

For common Sequelize patterns, refer to:
- [Sequelize Documentation](https://sequelize.org/)
- [MySQL 8 Syntax Reference](https://dev.mysql.com/doc/)
