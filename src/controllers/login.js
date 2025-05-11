import { UserModel } from '../models/user.js'
import sequelize from '../config/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const User = UserModel(sequelize)
const JWT_SECRET = process.env.JWT_SECRET

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      {
        id_user: user.id_user,
        name: `${user.name} ${user.lastname}`,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(200).json({
      message: 'Login successful',
      user: {
        id_user: user.id_user,
        name: `${user.name} ${user.lastname}`,
        email: user.email,
      },
      accessToken: token,
    })
  } catch (error) {
    console.error('Error during login:', error.message, error.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
}
