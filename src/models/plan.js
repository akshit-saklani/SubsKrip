const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Organization = require('./organization');

const Plan = sequelize.define('Plan', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    organization_id: { type: DataTypes.BIGINT, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    billing_cycle: { type: DataTypes.ENUM('monthly','yearly','custom'), allowNull: false },
    trial_days: { type: DataTypes.INTEGER, defaultValue: 0 },
    currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
    active_flag: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_by: { type: DataTypes.BIGINT, allowNull: false },
}, {
    tableName: 'plans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Plan.belongsTo(Organization, { foreignKey: 'organization_id' });

module.exports = Plan;
