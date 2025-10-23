const Organization = require('../models/organization');

class OrganizationBuilder {
    constructor() { this.organization = {}; }
    setName(name) { this.organization.name = name; return this; }
    setApiKey(key) { this.organization.api_key = key; return this; }
    setCreatedBy(userId) { this.organization.created_by = userId; return this; }
    build() { return this.organization; }
}

class OrganizationRepository {
    async create(orgObj) { return await Organization.create(orgObj); }
    async findById(id) { return await Organization.findByPk(id); }
    async findAll() { return await Organization.findAll({ where: { active_flag: 1 } }); }
    async update(id, updateObj) {
        const org = await this.findById(id);
        if (!org) throw new Error('Organization not found');
        return await org.update(updateObj);
    }
    async softDelete(id) { return await this.update(id, { active_flag: 0 }); }
}

module.exports = { OrganizationRepository, OrganizationBuilder };
