import React from 'react'
import { useNavigate } from 'react-router-dom'

function Footer() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💃</span>
              </div>
              <span className="text-white font-bold">DanceClass Pro</span>
            </div>
            <p className="text-gray-400 text-sm">
              Managing dance classes has never been easier. Manage students, fees, and analytics in one place.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/admin-login')}
                  className="hover:text-purple-400 transition"
                >
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/student-login')}
                  className="hover:text-purple-400 transition"
                >
                  Student Portal
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-purple-400 transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-purple-400 transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-purple-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-purple-400 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-purple-400 transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-purple-400 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#facebook"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition text-white"
              >
                f
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition text-white"
              >
                𝕏
              </a>
              <a
                href="#linkedin"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition text-white"
              >
                in
              </a>
              <a
                href="#instagram"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition text-white"
              >
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Dance Class Management System. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a href="#privacy" className="hover:text-purple-400 transition">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-purple-400 transition">
              Terms of Service
            </a>
            <a href="#contact" className="hover:text-purple-400 transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
