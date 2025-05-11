import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = {
      id: decoded.id,
      email: decoded.email,
    }
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}
