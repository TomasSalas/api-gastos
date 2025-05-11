import express from 'express'
import { createUser } from '../controllers/createUser.js'
import { createBill } from '../controllers/createBill.js'
import { login } from '../controllers/login.js'
import { logout } from '../controllers/logout.js'
import { auth } from '../middleware/auth.js'
import { getBills } from '../controllers/getBills.js'

const router = express()

router.post('/create-user', auth, createUser)
router.post('/create-bill', auth, createBill)
router.post('/login', login)
router.post('/logout', auth, logout)
router.get('/get-bills/:email', auth, getBills)

export default router
