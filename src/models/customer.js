const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Organization = require('./organization');

const Customer = sequelize.define('Customer', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    organization_id: { type: DataTypes.BIGINT, allowNull: false },
    customer_type: { type: DataTypes.ENUM('individual','organization'), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING(20) },
    org_customer_id: { type: DataTypes.BIGINT , allowNull:true },
    status: { type: DataTypes.ENUM('active','inactive'), defaultValue: 'active' },
    active_flag: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_by: { type: DataTypes.BIGINT, allowNull: false },
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Customer.belongsTo(Organization, { foreignKey: 'organization_id' });
Customer.belongsTo(Organization, { foreignKey: 'org_customer_id', as: 'orgCustomer' });

module.exports = Customer;
