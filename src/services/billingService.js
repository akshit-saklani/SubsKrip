const { BillingRepository, BillingBuilder } = require('../repository/Billing');

class BillingService {
    constructor() {
        this.billingRepo = new BillingRepository();
    }

    async createBilling({ subscriptionId, invoiceNumber, amount, currency, dueDate, createdBy }) {
        // build billing object
        const billing = new BillingBuilder()
            .setSubscriptionId(subscriptionId)
            .setInvoiceNumber(invoiceNumber)
            .setAmount(amount)
            .setCurrency(currency)
            .setDueDate(dueDate)
            .setCreatedBy(createdBy)
            .build();

        // save to DB
        return await this.billingRepo.create(billing);
    }

    async getBillingById(id) {
        return await this.billingRepo.findById(id);
    }

    async getBillingsBySubscription(subscriptionId) {
        return await this.billingRepo.findAllBySubscription(subscriptionId);
    }

    async markAsPaid(id) {
        return await this.billingRepo.update(id, { status: 'paid', paid_at: new Date() });
    }

    async deleteBilling(id) {
        return await this.billingRepo.softDelete(id);
    }
}

module.exports = BillingService;
