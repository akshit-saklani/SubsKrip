const Payment = require('../models/payment');

class PaymentBuilder {
    constructor() { this.payment = {}; }
    setBillingId(id) { this.payment.billing_id = id; return this; }
    setTransactionId(txId) { this.payment.transaction_id = txId; return this; }
    setGateway(gateway) { this.payment.gateway = gateway; return this; }
    setAmount(amount) { this.payment.amount = amount; return this; }
    setCurrency(currency) { this.payment.currency = currency; return this; }
    setStatus(status) { this.payment.status = status; return this; }
    setResponse(response) { this.payment.response = response; return this; }
    setCreatedBy(userId) { this.payment.created_by = userId; return this; }
    build() { return this.payment; }
}

class PaymentRepository {
    async create(payObj) { return await Payment.create(payObj); }
    async findById(id) { return await Payment.findByPk(id); }
    async findAllByBilling(billId) { return await Payment.findAll({ where: { billing_id: billId, active_flag: 1 } }); }
    async update(id, updateObj) {
        const payment = await this.findById(id);
        if (!payment) throw new Error('Payment not found');
        return await payment.update(updateObj);
    }
    async softDelete(id) { return await this.update(id, { active_flag: 0 }); }
}

module.exports = { PaymentRepository, PaymentBuilder };
