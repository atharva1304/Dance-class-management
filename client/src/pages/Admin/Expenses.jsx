import React, { useState, useEffect } from 'react'
import { getExpenses, createExpense, deleteExpense, updateExpense } from '../../services/expenseService'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('all') // all, month, custom
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
  })

  const categories = ['rent', 'utilities', 'equipment', 'maintenance', 'salary', 'other']
  const paymentMethods = ['cash', 'bank', 'upi', 'cheque']

  const CATEGORY_COLORS = {
    rent: '#ff6b6b',
    utilities: '#4ecdc4',
    equipment: '#95e1d3',
    maintenance: '#f38181',
    salary: '#aa96da',
    other: '#fcbad3'
  }

  // Load expenses on component mount
  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getExpenses()
      const expensesData = Array.isArray(response) ? response : response.data || []
      setExpenses(expensesData)
    } catch (err) {
      setError(err?.message || 'Failed to load expenses')
      console.error('Error loading expenses:', err)
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.category || !formData.amount || !formData.date) {
      setError('Category, amount, and date are required')
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        // Update existing expense
        await updateExpense(editingId, formData)
        setSuccess('Expense updated successfully!')
        setEditingId(null)
      } else {
        // Create new expense
        await createExpense(formData)
        setSuccess('Expense added successfully!')
      }

      // Reset form
      setFormData({
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
      })
      setShowForm(false)

      // Reload expenses
      await loadExpenses()
    } catch (err) {
      setError(err?.message || 'Failed to save expense')
      console.error('Error saving expense:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (expense) => {
    setFormData({
      category: expense.category,
      description: expense.description || '',
      amount: expense.amount || '',
      date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
      paymentMethod: expense.paymentMethod || 'cash',
    })
    setEditingId(expense.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id)
        setSuccess('Expense deleted successfully!')
        await loadExpenses()
      } catch (err) {
        setError(err?.message || 'Failed to delete expense')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
    })
  }

  // Filter expenses based on search, category, and date
  const getFilteredExpenses = () => {
    let filtered = expenses.filter(expense =>
      (expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === '' || expense.category === categoryFilter)
    )

    // Apply date filter
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const expenseDate = (dateStr) => new Date(dateStr)

    if (dateFilter === 'month') {
      filtered = filtered.filter(expense => {
        const date = expenseDate(expense.date)
        return date >= currentMonth && date <= now
      })
    } else if (dateFilter === 'custom') {
      if (customStartDate && customEndDate) {
        const startDate = new Date(customStartDate)
        const endDate = new Date(customEndDate)
        endDate.setHours(23, 59, 59, 999)
        filtered = filtered.filter(expense => {
          const date = expenseDate(expense.date)
          return date >= startDate && date <= endDate
        })
      }
    }

    return filtered
  }

  const filteredExpenses = getFilteredExpenses()

  // Calculate statistics
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  const categoryStats = categories.reduce((stats, cat) => {
    stats[cat] = filteredExpenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
    return stats
  }, {})

  // Pie chart data for categories
  const expensesByCategory = Object.entries(categoryStats)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount
    }))

  const getCategoryColor = (category) => {
    const colors = {
      rent: 'bg-red-100 text-red-800',
      utilities: 'bg-blue-100 text-blue-800',
      equipment: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      salary: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Expenses Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-semibold"
        >
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {editingId ? 'Edit Expense' : 'Add New Expense'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Method</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description of the expense"
                rows="2"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Expense' : 'Add Expense'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      {expenses.length > 0 && !showForm && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Dates</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateFilter === 'custom' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {loading && expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Loading expenses...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {expenses.length === 0 ? 'No expenses added yet. Click "Add Expense" to create one.' : 'No expenses match your filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Payment Method</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.description || '-'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{parseFloat(expense.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="capitalize">{expense.paymentMethod}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistics */}
      {expenses.length > 0 && (
        <div className="space-y-4">
          {/* Expense Categories Pie Chart */}
          {expensesByCategory.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎨 Expenses Distribution by Category</h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ₹${value.toFixed(0)} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    innerRadius={50}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {expensesByCategory.map((entry, index) => {
                      const categoryName = entry.name.toLowerCase()
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[categoryName] || '#999'}
                        />
                      )
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value.toFixed(2)}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #45B7D1', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Category Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200">
                {expensesByCategory.map((entry, index) => {
                  const categoryName = entry.name.toLowerCase()
                  const color = CATEGORY_COLORS[categoryName] || '#999'
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-semibold text-gray-700">{entry.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Total Expenses */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
            <p className="text-gray-600 text-sm font-semibold">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              ₹{totalExpenses.toFixed(2)}
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat} className={`rounded-lg p-4 border ${getCategoryColor(cat).replace('text-', 'border-').split(' ')[0]} ${getCategoryColor(cat).replace('bg-', 'bg-').split(' ')[0]}`}>
                <p className="text-gray-600 text-sm font-semibold capitalize">{cat}</p>
                <p className="text-2xl font-bold mt-1">
                  ₹{categoryStats[cat].toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
