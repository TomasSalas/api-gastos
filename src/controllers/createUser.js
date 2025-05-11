import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/user.js'
import sequelize from '../config/index.js'

const User = UserModel(sequelize)

export const createUser = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = await User.create({
      id_user: uuidv4(),
      name,
      lastname,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id_user: newUser.id_user,
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    })
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' })
    }
    console.error('Error creating user:', error.message, error.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
}
