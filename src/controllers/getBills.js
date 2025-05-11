import { UserModel } from '../models/user.js'
import sequelize from '../config/index.js'
import { BillsModel } from '../models/bills.js'

const User = UserModel(sequelize)
const Bills = BillsModel(sequelize)

export const getBills = async (req, res) => {
  try {
    const { email } = req.params

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const billsData = await Bills.findAll({
      where: { idUser: user.id_user },
    })

    if (billsData.length === 0) {
      return res.status(404).json({ error: 'No bills found for this user' })
    }

    const bills = billsData.map(bill => ({
      type: bill.type,
      amount: bill.amount,
      date: bill.date,
      description: bill.description,
    }))

    res.status(200).json({
      message: 'Bills retrieved successfully',
      result: bills,
    })
  } catch (error) {
    console.error('Error retrieving bills:', error.message, error.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
}
