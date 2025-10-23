const Billing = require('../models/billing');

class BillingBuilder {
    constructor() { this.billing = {}; }
    setSubscriptionId(id) { this.billing.subscription_id = id; return this; }
    setInvoiceNumber(num) { this.billing.invoice_number = num; return this; }
    setAmount(amount) { this.billing.amount = amount; return this; }
    setCurrency(currency) { this.billing.currency = currency; return this; }
    setStatus(status) { this.billing.status = status; return this; }
    setDueDate(date) { this.billing.due_date = date; return this; }
    setPaidAt(date) { this.billing.paid_at = date; return this; }
    setCreatedBy(userId) { this.billing.created_by = userId; return this; }
    build() { return this.billing; }
}

class BillingRepository {
    async create(billObj) { return await Billing.create(billObj); }
    async findById(id) { return await Billing.findByPk(id); }
    async findAllBySubscription(subId) { return await Billing.findAll({ where: { subscription_id: subId, active_flag: 1 } }); }
    async update(id, updateObj) {
        const bill = await this.findById(id);
        if (!bill) throw new Error('Billing not found');
        return await bill.update(updateObj);
    }
    async softDelete(id) { return await this.update(id, { active_flag: 0 }); }
}

module.exports = { BillingRepository, BillingBuilder };
