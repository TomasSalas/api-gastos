import express from 'express'
import sequelize from './config/index.js'
import router from './router/router.js'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
} else {
  app.use(helmet({ contentSecurityPolicy: false }))
}

app.use(cors({
  origin: ['http://localhost:5173', 'https://app-gastos.railway.internal'],
  credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(router)

sequelize.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database:', err))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
