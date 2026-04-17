# Dance Class Management System

A full-stack web application for managing dance classes, students, payments, and expenses.

## Features

- **Admin Dashboard**: Comprehensive analytics and student management
- **Student Portal**: Student-specific dashboard and payment history
- **Student Management**: Add, edit, and track students
- **Payment Tracking**: Record and monitor student payments
- **Expense Management**: Track all class expenses by category
- **Analytics**: Revenue, expense, and student statistics
- **Excel Upload**: Bulk import students from Excel files

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Mongoose** - MongoDB ORM

## Project Structure

```
dance-class-management/
├── client/                      # React Frontend
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── assets/              # Images, icons, styles
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── layouts/             # Layout components
│   │   ├── services/            # API service files
│   │   ├── context/             # Global state management
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Helper functions
│   │   ├── App.jsx              # Main App component
│   │   └── main.jsx             # React entry point
│   ├── package.json             # Frontend dependencies
│   ├── tailwind.config.js       # Tailwind configuration
│   └── postcss.config.js        # PostCSS configuration
│
├── server/                      # Express Backend
│   ├── config/                  # Configuration files
│   │   └── db.js                # MongoDB connection
│   ├── models/                  # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Student.js
│   │   ├── Expense.js
│   │   └── Payment.js
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── expenseController.js
│   │   ├── analyticsController.js
│   │   └── uploadController.js
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── uploadRoutes.js
│   ├── middlewares/             # Express middlewares
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── services/                # Business logic
│   │   ├── studentService.js
│   │   ├── expenseService.js
│   │   ├── analyticsService.js
│   │   └── excelService.js
│   ├── utils/                   # Helper utilities
│   │   ├── dateHelper.js
│   │   └── duplicateChecker.js
│   ├── uploads/                 # Uploaded files
│   ├── scripts/                 # Utility scripts
│   │   └── parseExcel.js
│   ├── server.js                # Entry point
│   ├── .env                     # Environment variables
│   └── package.json             # Backend dependencies
│
├── package.json                 # Root package.json
└── README.md                    # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dance-class-management
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/dance-class
   JWT_SECRET=your-secret-key-change-this
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

## Running the Application

### Development Mode

From the root directory:

```bash
# Run both client and server concurrently
npm run dev

# Or run separately in different terminals
npm run client    # Frontend on http://localhost:5173
npm run server    # Backend on http://localhost:5000
```

### Production Build

```bash
npm run build
npm start
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/:id/payments` - Get student payments
- `POST /api/students/:id/payments` - Add payment

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/categories` - Get expense categories

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/revenue` - Revenue data
- `GET /api/analytics/expenses` - Expense data
- `GET /api/analytics/students` - Student statistics
- `GET /api/analytics/payments` - Payment statistics

### Uploads
- `POST /api/uploads` - Upload Excel file
- `GET /api/uploads/status/:id` - Get upload status

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email and password
2. Server returns a JWT token
3. Client stores token in localStorage
4. Token is included in Authorization header for protected routes
5. Token expires in 7 days

## Database Models

### Admin
- Email, Password, Name, Phone, Role, IsActive

### Student
- Email, Password, Name, Phone, Address, DanceType, Level, BatchTiming
- FeeAmount, FeeFrequency, Status, JoinDate, LastPaymentDate, TotalPaid

### Expense
- Category, Description, Amount, Date, PaymentMethod, ReferenceNumber, Notes

### Payment
- StudentId, Amount, Date, Month, PaymentMethod, TransactionId, Status, Notes

## Features in Detail

### Admin Features
- View dashboard with statistics
- Manage students (CRUD operations)
- Track payments and revenue
- Manage expenses by category
- View analytics and reports
- Upload students from Excel

### Student Features
- View personal dashboard
- Check payment history
- View fees and due payments
- Track attendance (extensible)

## Development Notes

- All dates are stored in UTC
- Fees are stored in Indian Rupees (₹)
- Default user role is determined during login
- Error handling includes validation and database errors

## Future Enhancements

- SMS/Email notifications for payments
- Attendance tracking
- Performance analytics
- Mobile app
- Class scheduling
- Automated payment reminders
- Advanced reporting

## License

MIT

## Support

For issues or questions, please create an issue in the repository.