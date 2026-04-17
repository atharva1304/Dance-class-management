export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // TODO: Process Excel file
    // 1. Parse Excel file
    // 2. Validate data
    // 3. Import to database

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getUploadStatus = async (req, res) => {
  try {
    res.json({
      status: 'pending',
      message: 'Upload processing',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
