const Subscription = require('../models/subscription');

class SubscriptionBuilder {
    constructor() { this.subscription = {}; }
    setCustomerId(id) { this.subscription.customer_id = id; return this; }
    setPlanId(id) { this.subscription.plan_id = id; return this; }
    setStartDate(date) { this.subscription.start_date = date; return this; }
    setEndDate(date) { this.subscription.end_date = date; return this; }
    setStatus(status) { this.subscription.status = status; return this; }
    setAutoRenew(flag) { this.subscription.auto_renew = flag; return this; }
    setCreatedBy(userId) { this.subscription.created_by = userId; return this; }
    build() { return this.subscription; }
}

class SubscriptionRepository {
    async create(subObj) { return await Subscription.create(subObj); }
    async findById(id) { return await Subscription.findByPk(id); }
    async findAllByCustomer(customerId) { return await Subscription.findAll({ where: { customer_id: customerId, active_flag: 1 } }); }
    async update(id, updateObj) {
        const sub = await this.findById(id);
        if (!sub) throw new Error('Subscription not found');
        return await sub.update(updateObj);
    }
    async softDelete(id) { return await this.update(id, { active_flag: 0 }); }
}

module.exports = { SubscriptionRepository, SubscriptionBuilder };
