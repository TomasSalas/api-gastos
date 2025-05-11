import { UserModel } from '../models/user.js'
import sequelize from '../config/index.js'
import cookie from 'cookie'

const User = UserModel(sequelize)

export const logout = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    await User.update(
      { refreshtoken: null },
      { where: { email } }
    )

    res.setHeader('Set-Cookie', cookie.serialize('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(0),
      path: '/',
    }))

    return res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Error during logout:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
