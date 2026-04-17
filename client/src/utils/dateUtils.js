export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getMonthName = (monthNum) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return months[monthNum]
}

export const isDatePast = (date) => {
  return new Date(date) < new Date()
}

export const getDaysDifference = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay))
}
