const Customer = require('../models/customer');

class CustomerBuilder {
    constructor() { this.customer = {}; }
    setOrganizationId(orgId) { this.customer.organization_id = orgId; return this; }
    setType(type) { this.customer.customer_type = type; return this; }
    setName(name) { this.customer.name = name; return this; }
    setEmail(email) { this.customer.email = email; return this; }
    setPhone(phone) { this.customer.phone = phone; return this; }
    setOrgCustomerId(orgId) { this.customer.org_customer_id = orgId; return this; }
    setStatus(status) { this.customer.status = status; return this; }
    setCreatedBy(userId) { this.customer.created_by = userId; return this; }
    build() { return this.customer; }
}

class CustomerRepository {
    async create(customerObj) { return await Customer.create(customerObj); }
    async findById(id) { return await Customer.findByPk(id); }
    async findAllByOrganization(orgId) { return await Customer.findAll({ where: { organization_id: orgId, active_flag: 1 } }); }
    async update(id, updateObj) {
        const customer = await this.findById(id);
        if (!customer) throw new Error('Customer not found');
        return await customer.update(updateObj);
    }
    async softDelete(id) { return await this.update(id, { active_flag: 0 }); }
}

module.exports = { CustomerRepository, CustomerBuilder };
