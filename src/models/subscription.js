const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./customer');
const Plan = require('./plan');

const Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    customer_id: { type: DataTypes.BIGINT, allowNull: false },
    plan_id: { type: DataTypes.BIGINT, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.ENUM('active','canceled','expired','trialing','past_due'), defaultValue: 'active' },
    auto_renew: { type: DataTypes.BOOLEAN, defaultValue: true },
    active_flag: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_by: { type: DataTypes.BIGINT, allowNull: false },
}, {
    tableName: 'subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Subscription.belongsTo(Customer, { foreignKey: 'customer_id' });
Subscription.belongsTo(Plan, { foreignKey: 'plan_id' });

module.exports = Subscription;
