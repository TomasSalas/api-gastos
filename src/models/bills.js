import { DataTypes } from 'sequelize'

export const BillsModel = (sequelize) => {
  const Bill = sequelize.define('Bills', {
    id_bills: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    idUser: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: {
          tableName: 'users',
          schema: 'gastos',
        },
        key: 'id_user',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    subtype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'bills',
    schema: 'gastos',
    timestamps: false,
  })

  return Bill
}
