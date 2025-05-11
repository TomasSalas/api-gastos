import sequelize from '../config/index.js'
import { BillsModel } from '../models/bills.js'
import { UserModel } from '../models/user.js'

const Bill = BillsModel(sequelize)
const User = UserModel(sequelize)

export const createBill = async (req, res) => {
  try {
    const { email, type, amount, date, description } = req.body

    if (!email || !type || !amount || !date || !description) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const user = await User.findOne({ where: { email }, raw: true })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const newBill = await Bill.create({
      idUser: user.id_user,
      type,
      amount,
      date,
      description,
    })

    res.status(201).json({
      message: 'Bill created successfully',
      bill: {
        type: newBill.type,
        amount: newBill.amount,
        date: newBill.date,
        description: newBill.description,
      },
    })
  } catch (error) {
    console.error('Error creating bill:', error.message, error.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
}
