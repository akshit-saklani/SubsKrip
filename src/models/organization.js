const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Organization = sequelize.define('Organization', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    api_key: { type: DataTypes.STRING(64), unique: true, allowNull: false },
    active_flag: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_by: { type: DataTypes.BIGINT, allowNull: false },
}, {
    tableName: 'organizations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Organization;
