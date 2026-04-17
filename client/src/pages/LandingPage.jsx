import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import FeatureCard from '../components/common/FeatureCard'
import Footer from '../components/common/Footer'
import StatsCard from '../components/common/StatsCard'

function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: '👥',
      title: 'Student Management',
      description: 'Manage student profiles, enrollment, and personal information efficiently',
    },
    {
      icon: '💳',
      title: 'Fee Tracking',
      description: 'Track student fees, payments, and generate payment reminders automatically',
    },
    {
      icon: '📊',
      title: 'Expense Management',
      description: 'Monitor and manage all dance school expenses and operational costs',
    },
    {
      icon: '📈',
      title: 'Analytics Dashboard',
      description: 'Real-time insights into revenue, expenses, and school performance metrics',
    },
    {
      icon: '📁',
      title: 'Excel Upload',
      description: 'Bulk import student data and manage information efficiently with Excel',
    },
    {
      icon: '🔐',
      title: 'Secure Access',
      description: 'Role-based access control for admins and students with JWT authentication',
    },
  ]

  const stats = [
    { label: 'Total Students', value: '500+', icon: '👥' },
    { label: 'Total Revenue', value: '$50K+', icon: '💰' },
    { label: 'Monthly Expenses', value: '$5K', icon: '📊' },
    { label: 'Active Plans', value: '15+', icon: '✨' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Dance Class <br /> Management <br /> System
              </h1>
              <p className="text-xl text-purple-100">
                Manage students, fees, expenses & analytics easily. All-in-one solution for dance schools and studios.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate('/admin-login')}
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition transform hover:scale-105"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => navigate('/student-login')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition transform hover:scale-105"
                >
                  Student Login
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 h-20"></div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 h-20"></div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 h-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your dance class efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Our System</h2>
              <p className="text-gray-600 text-lg mb-4">
                Dance Class Management System is a comprehensive web application designed specifically for dance schools, studios, and instructors to streamline their operations.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                Whether you're managing a small class or a large dance academy, our system provides all the tools you need to manage students, track payments, monitor expenses, and gain valuable insights into your business.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">User-Friendly Interface</h4>
                    <p className="text-gray-600">Easy to use for admins and students alike</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-Time Analytics</h4>
                    <p className="text-gray-600">Get instant insights into your business metrics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure & Reliable</h4>
                    <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-purple-200">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600">1000+</div>
                  <div className="text-gray-600 mt-1">Dance Schools Using Our System</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-gray-600 mt-1">Students Managed Successfully</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600">$5M+</div>
                  <div className="text-gray-600 mt-1">Transaction Value Processed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
            <p className="text-xl text-gray-600">
              Get a quick glimpse of your dance school's performance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-6">
              <h3 className="text-2xl font-bold text-white">Sample Analytics</h3>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600 mb-2">156</div>
                  <p className="text-gray-600">Active Students</p>
                  <div className="mt-3 text-green-500 font-semibold text-sm">↑ 12% this month</div>
                </div>
                <div className="text-center border-l border-r border-gray-200">
                  <div className="text-5xl font-bold text-purple-600 mb-2">$45.2K</div>
                  <p className="text-gray-600">Total Revenue</p>
                  <div className="mt-3 text-green-500 font-semibold text-sm">↑ 8% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600 mb-2">$8.5K</div>
                  <p className="text-gray-600">Total Expenses</p>
                  <div className="mt-3 text-red-500 font-semibold text-sm">↑ 3% this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Managing Your Dance Class Today
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of dance schools and studios already using our system to streamline their operations and improve their bottom line.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/admin-login')}
              className="bg-white text-purple-600 px-10 py-4 rounded-lg font-semibold hover:bg-purple-50 transition transform hover:scale-105 text-lg"
            >
              Get Started as Admin
            </button>
            <button
              onClick={() => navigate('/student-login')}
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition transform hover:scale-105 text-lg"
            >
              Login as Student
            </button>
          </div>

          <p className="text-purple-100 mt-8 text-sm">
            No credit card required. Free demo access available.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
