import Student from '../models/Student.js'

export const findDuplicateEmails = async (emails) => {
  const duplicates = []
  const emailCounts = {}

  emails.forEach((email) => {
    emailCounts[email] = (emailCounts[email] || 0) + 1
  })

  Object.entries(emailCounts).forEach(([email, count]) => {
    if (count > 1) {
      duplicates.push(email)
    }
  })

  return duplicates
}

export const findDuplicateStudents = async (students) => {
  const duplicates = []

  for (const student of students) {
    const existing = await Student.findOne({ email: student.email })
    if (existing) {
      duplicates.push({
        email: student.email,
        existingId: existing._id,
      })
    }
  }

  return duplicates
}

export const removeDuplicates = (array, key) => {
  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}
