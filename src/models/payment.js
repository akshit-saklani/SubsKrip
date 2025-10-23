const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Billing = require('./billing');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    billing_id: { type: DataTypes.BIGINT, allowNull: false },
    transaction_id: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    gateway: { type: DataTypes.STRING(50), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
    status: { type: DataTypes.ENUM('initiated','success','failed','refunded'), defaultValue: 'initiated' },
    response: { type: DataTypes.TEXT },
    active_flag: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_by: { type: DataTypes.BIGINT, allowNull: false },
}, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Payment.belongsTo(Billing, { foreignKey: 'billing_id' });

module.exports = Payment;
