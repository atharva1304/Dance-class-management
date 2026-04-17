import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function StudentLayout() {
  const { logout, user } = useAuth()

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Dance Student Portal</h1>
        <ul className="space-y-4">
          <li>
            <Link to="/student/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/student/payment-history" className="hover:text-gray-300">
              Payment History
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold">Welcome, {user?.email}</h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
