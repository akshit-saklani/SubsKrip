// models/index.js
const sequelize = require('../config/db');
const Organization = require('./organization');
const User = require('./user');
const Customer = require('./customer');
const Plan = require('./plan');
const Subscription = require('./subscription');
const Billing = require('./billing');
const Payment = require('./payment');

// Define relationships
Organization.hasMany(User, { foreignKey: 'organization_id' });
User.belongsTo(Organization, { foreignKey: 'organization_id' });

Organization.hasMany(Customer, { foreignKey: 'organization_id' });
Customer.belongsTo(Organization, { foreignKey: 'organization_id' });

Organization.hasMany(Plan, { foreignKey: 'organization_id' });
Plan.belongsTo(Organization, { foreignKey: 'organization_id' });

Customer.hasMany(Subscription, { foreignKey: 'customer_id' });
Subscription.belongsTo(Customer, { foreignKey: 'customer_id' });

Plan.hasMany(Subscription, { foreignKey: 'plan_id' });
Subscription.belongsTo(Plan, { foreignKey: 'plan_id' });

Subscription.hasMany(Billing, { foreignKey: 'subscription_id' });
Billing.belongsTo(Subscription, { foreignKey: 'subscription_id' });

Billing.hasMany(Payment, { foreignKey: 'billing_id' });
Payment.belongsTo(Billing, { foreignKey: 'billing_id' });

module.exports = {
  sequelize,
  Organization,
  User,
  Customer,
  Plan,
  Subscription,
  Billing,
  Payment,
};
