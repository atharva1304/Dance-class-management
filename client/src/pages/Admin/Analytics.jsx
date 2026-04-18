import React, { useState, useEffect } from 'react'
import { getStudents } from '../../services/studentService'
import { getExpenses } from '../../services/expenseService'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function Analytics() {
  const [students, setStudents] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('all') // all, month, quarter, year

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      const [studentsRes, expensesRes] = await Promise.all([
        getStudents(),
        getExpenses()
      ])
      
      setStudents(Array.isArray(studentsRes) ? studentsRes : studentsRes.data || [])
      setExpenses(Array.isArray(expensesRes) ? expensesRes : expensesRes.data || [])
    } catch (err) {
      console.error('Error loading analytics data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate key metrics
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'active').length
  const inactiveStudents = students.filter(s => s.status === 'inactive').length
  const suspendedStudents = students.filter(s => s.status === 'suspended').length

  const totalRevenue = students.reduce((sum, s) => sum + parseFloat(s.feeAmount || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  const netProfit = totalRevenue - totalExpenses

  // Revenue by Duration
  const durationStats = {
    '1': students.filter(s => s.duration === '1').reduce((sum, s) => sum + parseFloat(s.feeAmount || 0), 0),
    '3': students.filter(s => s.duration === '3').reduce((sum, s) => sum + parseFloat(s.feeAmount || 0), 0),
    '6': students.filter(s => s.duration === '6').reduce((sum, s) => sum + parseFloat(s.feeAmount || 0), 0),
  }

  // Expenses by Category
  const expensesByCategory = {
    rent: expenses.filter(e => e.category === 'rent').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
    utilities: expenses.filter(e => e.category === 'utilities').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
    equipment: expenses.filter(e => e.category === 'equipment').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
    maintenance: expenses.filter(e => e.category === 'maintenance').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
    salary: expenses.filter(e => e.category === 'salary').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
    other: expenses.filter(e => e.category === 'other').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
  }

  // Dance Type Distribution
  const danceTypes = {}
  students.forEach(s => {
    if (s.danceType) {
      danceTypes[s.danceType] = (danceTypes[s.danceType] || 0) + 1
    }
  })

  // Payment Method Distribution
  const paymentMethods = {}
  expenses.forEach(e => {
    if (e.paymentMethod) {
      paymentMethods[e.paymentMethod] = (paymentMethods[e.paymentMethod] || 0) + 1
    }
  })

  // Chart Data: Income vs Expenses
  const incomeExpensesData = [
    {
      name: 'Financial Overview',
      income: totalRevenue,
      expenses: totalExpenses,
    }
  ]

  // Chart Data: Income vs Expenses Pie
  const incomeExpensesPieData = [
    { name: 'Total Income', value: totalRevenue },
    { name: 'Total Expenses', value: totalExpenses }
  ]

  // Chart Data: Expense Categories Pie
  const expenseCategoriesPieData = Object.entries(expensesByCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount
    }))

  // Colors for charts
  const COLORS_INCOME_EXPENSE = ['#10b981', '#ef4444']
  const COLORS_EXPENSE_CATEGORIES = [
    '#f87171', '#60a5fa', '#a78bfa', '#facc15', '#10b981', '#8b5cf6'
  ]

  // Enhanced Interactive Colors
  const VIBRANT_COLORS = {
    income: '#06b6d4',
    expenses: '#f43f5e',
  }

  const CATEGORY_COLORS = {
    rent: '#ff6b6b',
    utilities: '#4ecdc4',
    equipment: '#95e1d3',
    maintenance: '#f38181',
    salary: '#aa96da',
    other: '#fcbad3'
  }

  const INTERACTIVE_GRADIENT_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E2', '#F8B739', '#52C41A', '#13C2C2', '#EB2F96'
  ]

  // Monthly Revenue & Expenses
  const monthlyData = {}
  const currentYear = new Date().getFullYear()
  
  students.forEach(s => {
    const month = 'Current'
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 }
    monthlyData[month].revenue += parseFloat(s.feeAmount || 0)
  })

  expenses.forEach(e => {
    const month = 'Current'
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 }
    monthlyData[month].expenses += parseFloat(e.amount || 0)
  })

  // Average fee per student
  const averageFee = totalStudents > 0 ? (totalRevenue / totalStudents).toFixed(2) : 0

  // Highest expense category
  const highestExpenseCategory = Object.entries(expensesByCategory).reduce((max, [key, val]) => 
    val > max.val ? { key, val } : max, { key: '-', val: 0 }
  )

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📊 Analytics Dashboard</h1>
            <p className="text-purple-100">Real-time insights into your dance business performance</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border-2 border-purple-300 bg-white text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading analytics...</div>
      ) : (
        <>
          {/* Key Metrics - Row 1 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">💼 Key Metrics</h3>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Total Students</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{totalStudents}</p>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Active Students</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">{activeStudents}</p>
                  </div>
                  <span className="text-3xl">✅</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Total Revenue</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">₹{totalRevenue.toFixed(0)}</p>
                  </div>
                  <span className="text-3xl">💰</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Total Expenses</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">₹{totalExpenses.toFixed(0)}</p>
                  </div>
                  <span className="text-3xl">💸</span>
                </div>
              </div>

              <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-orange-50 to-orange-100 border-orange-200'} rounded-lg p-6 border hover:shadow-lg hover:scale-105 transition-all`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Net Profit</p>
                    <p className={`text-3xl font-bold mt-2 ${netProfit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                      ₹{netProfit.toFixed(0)}
                    </p>
                  </div>
                  <span className="text-3xl">{netProfit >= 0 ? '📈' : '📉'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics - Row 2 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">📊 Additional Insights</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Inactive</p>
                    <p className="text-4xl font-bold text-yellow-600 mt-2">{inactiveStudents}</p>
                  </div>
                  <span className="text-3xl">⏸️</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Suspended</p>
                    <p className="text-4xl font-bold text-orange-600 mt-2">{suspendedStudents}</p>
                  </div>
                  <span className="text-3xl">🚫</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Average Fee</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">₹{averageFee}</p>
                  </div>
                  <span className="text-3xl">💵</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Profit Margin</p>
                    <p className="text-4xl font-bold text-pink-600 mt-2">
                      {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <span className="text-3xl">📈</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue by Duration */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">⏱️ Revenue by Duration</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-6 border-2 border-cyan-300 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📅</span>
                  <span className="text-xs font-bold bg-cyan-600 text-white px-2 py-1 rounded-full">{students.filter(s => s.duration === '1').length}</span>
                </div>
                <p className="text-gray-600 text-sm font-semibold">1 Month Duration</p>
                <p className="text-3xl font-bold text-cyan-600 mt-2">₹{durationStats['1'].toFixed(0)}</p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border-2 border-teal-300 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📆</span>
                  <span className="text-xs font-bold bg-teal-600 text-white px-2 py-1 rounded-full">{students.filter(s => s.duration === '3').length}</span>
                </div>
                <p className="text-gray-600 text-sm font-semibold">3 Month Duration</p>
                <p className="text-3xl font-bold text-teal-600 mt-2">₹{durationStats['3'].toFixed(0)}</p>
              </div>

              <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-lg p-6 border-2 border-lime-300 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📊</span>
                  <span className="text-xs font-bold bg-lime-600 text-white px-2 py-1 rounded-full">{students.filter(s => s.duration === '6').length}</span>
                </div>
                <p className="text-gray-600 text-sm font-semibold">6 Month Duration</p>
                <p className="text-3xl font-bold text-lime-600 mt-2">₹{durationStats['6'].toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">📈 Financial Overview Charts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Income vs Expenses Bar Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={incomeExpensesData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value) => `₹${value.toFixed(2)}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #06b6d4', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    cursor={{ fill: 'rgba(100, 200, 255, 0.1)' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar 
                    dataKey="income" 
                    fill="#06b6d4" 
                    name="Total Income" 
                    radius={[12, 12, 0, 0]}
                    animationDuration={800}
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="#f43f5e" 
                    name="Total Expenses" 
                    radius={[12, 12, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

              {/* Income vs Expenses Pie Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Income vs Expenses Ratio</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeExpensesPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ₹${value.toFixed(0)} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                  >
                    <Cell fill="#06b6d4" />
                    <Cell fill="#f43f5e" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value.toFixed(2)}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #06b6d4', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Dance Type Distribution */}
          {Object.keys(danceTypes).length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">🎭 Student Distribution by Dance Type</h3>
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(danceTypes).map(([type, count]) => (
                    <div key={type} className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 border-2 border-indigo-200 hover:shadow-lg hover:scale-105 transition-all text-center">
                      <span className="text-3xl">💃</span>
                      <p className="text-gray-700 text-sm font-bold mt-2 uppercase tracking-wide">{type}</p>
                      <p className="text-3xl font-bold text-indigo-600 mt-2">{count}</p>
                      <p className="text-xs text-indigo-600 font-semibold mt-1">
                        {((count / totalStudents) * 100).toFixed(1)}% of students
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Distribution */}
          {Object.keys(paymentMethods).length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">💳 Payment Methods Used</h3>
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="grid md:grid-cols-4 gap-4">
                  {Object.entries(paymentMethods).map(([method, count]) => {
                    const methodIcons = {
                      'cash': '💵',
                      'bank': '🏦',
                      'upi': '📱',
                      'cheque': '📝'
                    }
                    return (
                      <div key={method} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-2 border-blue-200 hover:shadow-lg hover:scale-105 transition-all text-center">
                        <span className="text-3xl">{methodIcons[method] || '💰'}</span>
                        <p className="text-gray-700 text-sm font-bold mt-2 uppercase tracking-wide capitalize">{method}</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{count}</p>
                        <p className="text-xs text-blue-600 font-semibold mt-1">transactions</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Status Summary */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">👥 Student Status Summary</h3>
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-bold text-lg">✅ Active</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="w-80 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600"
                        style={{ width: totalStudents > 0 ? `${(activeStudents / totalStudents) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-green-600 w-12 text-right">{activeStudents}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-bold text-lg">⏸️ Inactive</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="w-80 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                        style={{ width: totalStudents > 0 ? `${(inactiveStudents / totalStudents) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-yellow-600 w-12 text-right">{inactiveStudents}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-bold text-lg">🚫 Suspended</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="w-80 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                        style={{ width: totalStudents > 0 ? `${(suspendedStudents / totalStudents) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-orange-600 w-12 text-right">{suspendedStudents}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">💡 Additional Business Insights</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg p-6 border-2 border-violet-300 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💸</span>
                </div>
                <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Highest Expense</p>
                <p className="text-3xl font-bold text-violet-600 mt-2 capitalize">{highestExpenseCategory.key}</p>
                <p className="text-sm text-violet-700 font-semibold mt-2">₹{highestExpenseCategory.val.toFixed(0)}</p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-6 border-2 border-rose-300 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Monthly Avg Revenue</p>
                <p className="text-3xl font-bold text-rose-600 mt-2">₹{(totalRevenue / 12).toFixed(0)}</p>
                <p className="text-sm text-rose-700 font-semibold mt-2">Annualized estimate</p>
              </div>

              <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border-2 border-sky-300 hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-gray-600 text-xs font-bold uppercase tracking-wide">Break-even Point</p>
                <p className="text-3xl font-bold text-sky-600 mt-2">
                  {totalExpenses > 0 && totalRevenue > 0 
                    ? (totalExpenses / (totalRevenue / totalStudents)).toFixed(1) 
                    : '-'}
                </p>
                <p className="text-sm text-sky-700 font-semibold mt-2">students needed</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
