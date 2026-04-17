import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'

// Layouts
import AdminLayout from './layouts/AdminLayout'
import StudentLayout from './layouts/StudentLayout'

// Landing Page
import LandingPage from './pages/LandingPage'

// Auth Pages
import AdminLogin from './pages/Auth/AdminLogin'
import StudentLogin from './pages/Auth/StudentLogin'

// Admin Pages
import Dashboard from './pages/Admin/Dashboard'
import Students from './pages/Admin/Students'
import Expenses from './pages/Admin/Expenses'
import Analytics from './pages/Admin/Analytics'
import UploadExcel from './pages/Admin/UploadExcel'

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard'
import PaymentHistory from './pages/Student/PaymentHistory'

function ProtectedRoute({ children, userType }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  if (!user) return <Navigate to="/login" />
  if (user.role !== userType) return <Navigate to="/login" />

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/login" element={<Navigate to="/admin-login" />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute userType="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="upload-excel" element={<UploadExcel />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute userType="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="payment-history" element={<PaymentHistory />} />
          </Route>

          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
