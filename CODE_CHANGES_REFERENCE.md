# Code Changes: Before & After Reference

This document provides side-by-side comparisons of key code changes from MongoDB to MySQL/Sequelize.

---

## 🗂️ Configuration Changes

### Database Connection

#### Before (MongoDB)
```javascript
// server/config/db.js
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/dance-class'
    )
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
export default connectDB
```

#### After (MySQL/Sequelize)
```javascript
// server/config/db.js
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME || 'dance_class_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('MySQL Connected successfully')
    await sequelize.sync({ alter: true })
    console.log('Database synchronized')
    return sequelize
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

export default sequelize
```

### Environment Variables

#### Before
```env
MONGODB_URI=mongodb://localhost:27017/dance-class
JWT_SECRET=your-secret-key-change-this
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### After
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dance_class_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your-secret-key-change-this
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## 📦 Model Changes

### Admin Model

#### Before (Mongoose)
```javascript
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: String,
  phone: String,
  role: { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

AdminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('Admin', AdminSchema)
```

#### After (Sequelize)
```javascript
import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '../config/db.js'

const Admin = sequelize.define(
  'Admin',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING(255), allowNull: false },
    name: { type: DataTypes.STRING(255) },
    phone: { type: DataTypes.STRING(20) },
    role: {
      type: DataTypes.ENUM('admin', 'superadmin'),
      defaultValue: 'admin',
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: async (admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 10)
        }
      },
    },
  }
)

Admin.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

export default Admin
```

### Payment Model with Relationships

#### Before (Mongoose)
```javascript
const PaymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  month: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'upi', 'check', 'online'],
    default: 'cash',
  },
  transactionId: String,
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled', 'refunded'],
    default: 'completed',
  },
  notes: String,
}, { timestamps: true })

export default mongoose.model('Payment', PaymentSchema)
```

#### After (Sequelize with FK)
```javascript
import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import Student from './Student.js'

const Payment = sequelize.define(
  'Payment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Student, key: 'id' },
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    month: { type: DataTypes.STRING(50) },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'bank', 'upi', 'check', 'online'),
      defaultValue: 'cash',
    },
    transactionId: { type: DataTypes.STRING(255) },
    status: {
      type: DataTypes.ENUM('completed', 'pending', 'cancelled', 'refunded'),
      defaultValue: 'completed',
    },
    notes: { type: DataTypes.TEXT },
  },
  { timestamps: true }
)

// Setup relationships
Payment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' })
Student.hasMany(Payment, { foreignKey: 'studentId', as: 'payments' })

export default Payment
```

---

## 🎯 Controller Changes

### Authentication Controller - Login

#### Before (MongoDB)
```javascript
export const login = async (req, res) => {
  const { email, password, role } = req.body
  const Model = role === 'admin' ? Admin : Student
  
  const user = await Model.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  
  const isPasswordValid = role === 'admin' 
    ? await user.comparePassword(password) 
    : password === user.password
  
  if (!isPasswordValid) 
    return res.status(401).json({ message: 'Invalid credentials' })
  
  const token = jwt.sign(
    { id: user._id, email: user.email, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )
  
  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role,
    },
  })
}
```

#### After (Sequelize)
```javascript
export const login = async (req, res) => {
  const { email, password, role } = req.body
  const Model = role === 'admin' ? Admin : Student
  
  const user = await Model.findOne({ where: { email } })  // ← Changed
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  
  const isPasswordValid = role === 'admin' 
    ? await user.comparePassword(password) 
    : password === user.password
  
  if (!isPasswordValid) 
    return res.status(401).json({ message: 'Invalid credentials' })
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role },  // ← user.id instead of user._id
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )
  
  res.json({
    token,
    user: {
      id: user.id,  // ← user.id instead of user._id
      email: user.email,
      name: user.name,
      role,
    },
  })
}
```

### Student Controller - Get Students with Search

#### Before (MongoDB)
```javascript
export const getStudents = async (req, res) => {
  const { status, level, searchTerm } = req.query
  let query = {}
  
  if (status) query.status = status
  if (level) query.level = level
  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
    ]
  }
  
  const students = await Student.find(query).sort({ createdAt: -1 })
  res.json(students)
}
```

#### After (Sequelize)
```javascript
import { Op } from 'sequelize'

export const getStudents = async (req, res) => {
  const { status, level, searchTerm } = req.query
  let where = {}  // ← Changed from query to where
  
  if (status) where.status = status
  if (level) where.level = level
  if (searchTerm) {
    where[Op.or] = [  // ← Sequelize Op.or
      { name: { [Op.like]: `%${searchTerm}%` } },  // ← Op.like for LIKE queries
      { email: { [Op.like]: `%${searchTerm}%` } },
    ]
  }
  
  const students = await Student.findAll({  // ← findAll instead of find
    where,
    order: [['createdAt', 'DESC']],  // ← order instead of sort
  })
  res.json(students)
}
```

### Student Controller - Update Student

#### Before (MongoDB)
```javascript
export const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!student) return res.status(404).json({ message: 'Student not found' })
  res.json(student)
}
```

#### After (Sequelize)
```javascript
export const updateStudent = async (req, res) => {
  const student = await Student.findByPk(req.params.id)  // ← findByPk instead of findById
  if (!student) return res.status(404).json({ message: 'Student not found' })
  
  await student.update(req.body)  // ← update() method
  res.json(student)
}
```

### Student Controller - Add Payment with Increment

#### Before (MongoDB)
```javascript
export const addPayment = async (req, res) => {
  const { amount, paymentMethod, transactionId, notes } = req.body
  
  const payment = new Payment({
    studentId: req.params.id,
    amount,
    paymentMethod,
    transactionId,
    notes,
    date: new Date(),
  })
  await payment.save()
  
  // Update student's total paid
  const student = await Student.findById(req.params.id)
  student.totalPaid += amount  // Manual increment
  student.lastPaymentDate = new Date()
  await student.save()
  
  res.status(201).json(payment)
}
```

#### After (Sequelize)
```javascript
export const addPayment = async (req, res) => {
  const { amount, paymentMethod, transactionId, notes } = req.body
  
  const payment = await Payment.create({  // ← create instead of new + save
    studentId: req.params.id,
    amount,
    paymentMethod,
    transactionId,
    notes,
    date: new Date(),
  })
  
  // Update student's total paid
  const student = await Student.findByPk(req.params.id)
  await student.increment('totalPaid', { by: amount })  // ← atomic increment
  await student.update({ lastPaymentDate: new Date() })
  
  res.status(201).json(payment)
}
```

---

## 📊 Analytics Controller - Aggregation

### Dashboard Stats

#### Before (MongoDB Aggregation)
```javascript
export const getDashboardStats = async (req, res) => {
  const totalStudents = await Student.countDocuments({ status: 'active' })
  
  const totalExpenses = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ])
  
  res.json({
    totalStudents,
    totalExpenses: totalExpenses[0]?.total || 0,
    totalRevenue: totalRevenue[0]?.total || 0,
    netProfit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0),
  })
}
```

#### After (Sequelize SQL)
```javascript
import { fn, col } from 'sequelize'

export const getDashboardStats = async (req, res) => {
  const totalStudents = await Student.count({ where: { status: 'active' } })
  
  const totalExpensesResult = await Expense.findAll({
    attributes: [[fn('SUM', col('amount')), 'total']],
    raw: true,
  })
  const totalExpenses = totalExpensesResult[0]?.total || 0
  
  const totalRevenueResult = await Payment.findAll({
    where: { status: 'completed' },
    attributes: [[fn('SUM', col('amount')), 'total']],
    raw: true,
  })
  const totalRevenue = totalRevenueResult[0]?.total || 0
  
  res.json({
    totalStudents,
    totalExpenses: parseFloat(totalExpenses) || 0,
    totalRevenue: parseFloat(totalRevenue) || 0,
    netProfit: (parseFloat(totalRevenue) || 0) - (parseFloat(totalExpenses) || 0),
  })
}
```

### Get Student Stats with GROUP BY

#### Before (MongoDB)
```javascript
export const getStudentStats = async (req, res) => {
  const stats = await Student.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])
  res.json(stats)
}
```

#### After (Sequelize)
```javascript
import { fn, col } from 'sequelize'

export const getStudentStats = async (req, res) => {
  const stats = await Student.findAll({
    attributes: [
      'status',
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  })
  
  const formattedStats = stats.map(s => ({
    _id: s.status,
    count: parseInt(s.count),
  }))
  
  res.json(formattedStats)
}
```

---

## 🔧 Query Operator Mapping

| Operation | MongoDB | Sequelize |
|-----------|---------|-----------|
| **Find** | `.find()` | `.findAll()` |
| **Find by ID** | `.findById(id)` | `.findByPk(id)` |
| **Find one** | `.findOne({...})` | `.findOne({where:{...}})` |
| **Create** | `new Model().save()` | `Model.create()` |
| **Update** | `.findByIdAndUpdate()` | `findByPk().update()` |
| **Delete** | `.findByIdAndDelete()` | `findByPk().destroy()` |
| **Count** | `.countDocuments()` | `.count()` |
| **Equal** | `{field: value}` | `{where: {field: value}}` |
| **OR** | `{$or: [...]}` | `{where: {[Op.or]: [...]}}` |
| **NOT EQUAL** | `{$ne: value}` | `{[Op.ne]: value}` |
| **Greater than** | `{$gt: value}` | `{[Op.gt]: value}` |
| **Greater/equal** | `{$gte: value}` | `{[Op.gte]: value}` |
| **Less than** | `{$lt: value}` | `{[Op.lt]: value}` |
| **Less/equal** | `{$lte: value}` | `{[Op.lte]: value}` |
| **LIKE** | `{$regex}` | `{[Op.like]: '%text%'}` |
| **SORT** | `.sort({field: 1})` | `order: [['field', 'ASC']]` |
| **GROUP BY** | `{$group}` | `group: ['field']` |
| **SUM** | `{$sum: '$field'}` | `fn('SUM', col('field'))` |
| **COUNT** | `{$sum: 1}` | `fn('COUNT', col('id'))` |

---

## 📝 Service Changes Example

### Student Service - Get with Payments

#### Before (MongoDB)
```javascript
export const getStudentWithPayments = async (id) => {
  const student = await Student.findById(id)
  const payments = await Payment.find({ studentId: id })
  return {
    ...student.toObject(),
    payments,
  }
}
```

#### After (Sequelize)
```javascript
export const getStudentWithPayments = async (id) => {
  return await Student.findByPk(id, {
    include: {
      association: 'payments',
      attributes: ['id', 'amount', 'date', 'status', 'paymentMethod'],
    },
  })
}
```

---

## 🚀 Summary of Changes

| Aspect | Before | After |
|--------|--------|-------|
| ORM | Mongoose | Sequelize |
| Database | MongoDB | MySQL |
| Connection | Direct URI | Sequelize connection pool |
| Models | Schema-based | Sequelize Models |
| Query Operators | `$regex`, `$or`, `$sum` | `Op.like`, `Op.or`, `fn('SUM')` |
| ID Type | ObjectId | INTEGER |
| Finding | `.find()`, `.findById()` | `.findAll()`, `.findByPk()` |
| Creating | `new Model().save()` | `Model.create()` |
| Updating | `.findByIdAndUpdate()` | `findByPk().update()` |
| Deleting | `.findByIdAndDelete()` | `findByPk().destroy()` |
| Counting | `.countDocuments()` | `.count()` |
| Aggregation | `.aggregate()` | `.findAll()` with `fn()` |
| Relationships | `ref` field | Foreign Key + Associations |

---

## 💡 Key Learning Points

1. **`where` clause** - Sequelize conditions go in `where: {}` object
2. **Sequelize Operators** - Import `Op` from sequelize for advanced queries
3. **`fn()` and `col()`** - Use for SQL functions like SUM, COUNT
4. **`findByPk()`** - Replaces `findById()` for primary key lookups
5. **`.increment()`** - Atomic increment without race conditions
6. **Associations** - Define relationships explicitly with `belongsTo()` and `hasMany()`
7. **Timestamps** - Automatically managed by Sequelize with `timestamps: true`
8. **Indexes** - Defined at model level for better performance

---

## 🔗 Related Documentation

- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
- [MYSQL_MIGRATION.md](./MYSQL_MIGRATION.md)
- [QUICKSTART_MYSQL.md](./QUICKSTART_MYSQL.md)
- [Sequelize Documentation](https://sequelize.org/)
