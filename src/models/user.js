const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Organization = require('./organization');

const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    organization_id: { type: DataTypes.BIGINT, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin','manager','finance','viewer'), defaultValue: 'viewer' },
    active_flag: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_by: { type: DataTypes.BIGINT, allowNull: false },
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.belongsTo(Organization, { foreignKey: 'organization_id' });

module.exports = User;
