const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Subscription = require('./subscription');

const Billing = sequelize.define('Billing', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    subscription_id: { type: DataTypes.BIGINT, allowNull: false },
    invoice_number: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
    status: { type: DataTypes.ENUM('pending','paid','failed'), defaultValue: 'pending' },
    due_date: { type: DataTypes.DATEONLY },
    paid_at: { type: DataTypes.DATE },
    active_flag: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_by: { type: DataTypes.BIGINT, allowNull: false },
}, {
    tableName: 'billings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Billing.belongsTo(Subscription, { foreignKey: 'subscription_id' });

module.exports = Billing;
