const Plan = require('../models/plan');

class PlanBuilder {
    constructor() { this.plan = {}; }
    setOrganizationId(orgId) { this.plan.organization_id = orgId; return this; }
    setName(name) { this.plan.name = name; return this; }
    setDescription(desc) { this.plan.description = desc; return this; }
    setPrice(price) { this.plan.price = price; return this; }
    setBillingCycle(cycle) { this.plan.billing_cycle = cycle; return this; }
    setTrialDays(days) { this.plan.trial_days = days; return this; }
    setCurrency(currency) { this.plan.currency = currency; return this; }
    setCreatedBy(userId) { this.plan.created_by = userId; return this; }
    build() { return this.plan; }
}

class PlanRepository {
    async create(planObj) { return await Plan.create(planObj); }
    async findById(id) { return await Plan.findByPk(id); }
    async findAllByOrganization(orgId) { return await Plan.findAll({ where: { organization_id: orgId, active_flag: 1 } }); }
    async update(id, updateObj) {
        const plan = await this.findById(id);
        if (!plan) throw new Error('Plan not found');
        return await plan.update(updateObj);
    }
    async softDelete(id) { return await this.update(id, { active_flag: 0 }); }
}

module.exports = { PlanRepository, PlanBuilder };
