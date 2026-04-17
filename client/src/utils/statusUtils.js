export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
}

export const STUDENT_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated',
  SUSPENDED: 'suspended',
}

export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
    graduated: 'bg-indigo-100 text-indigo-800',
    suspended: 'bg-orange-100 text-orange-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getStatusLabel = (status) => {
  const labels = {
    active: 'Active',
    inactive: 'Inactive',
    completed: 'Completed',
    pending: 'Pending',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    graduated: 'Graduated',
    suspended: 'Suspended',
  }
  return labels[status] || status
}
