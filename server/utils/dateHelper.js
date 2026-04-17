export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const getMonthYear = (date) => {
  const d = new Date(date)
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

export const isDateWithinRange = (date, startDate, endDate) => {
  const d = new Date(date)
  return d >= startDate && d <= endDate
}

export const getDaysFromToday = (date) => {
  const today = new Date()
  const d = new Date(date)
  const diffTime = Math.abs(d - today)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const addDaysToDate = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
