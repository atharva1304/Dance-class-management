import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">💃</span>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">
            DanceClass Pro
          </span>
        </div>

        {/* Menu Links */}
        <div className="hidden md:flex gap-8">
          <a href="#features" className="text-gray-600 hover:text-purple-600 transition">
            Features
          </a>
          <a href="#about" className="text-gray-600 hover:text-purple-600 transition">
            About
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition">
            Pricing
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin-login')}
            className="text-purple-600 px-4 py-2 rounded-lg border border-purple-600 hover:bg-purple-50 transition font-semibold"
          >
            Admin
          </button>
          <button
            onClick={() => navigate('/student-login')}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition font-semibold"
          >
            Student
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
