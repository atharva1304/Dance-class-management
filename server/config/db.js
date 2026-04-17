import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME || 'dance_class_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('MySQL Connected successfully')
    
    // Sync models with database
    await sequelize.sync({ alter: true })
    console.log('Database synchronized')
    
    return sequelize
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

export default sequelize
