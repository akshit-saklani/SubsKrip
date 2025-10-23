const User = require('../models/user');

class UserBuilder {
    constructor() { this.user = {}; }
    setOrganizationId(orgId) { this.user.organization_id = orgId; return this; }
    setName(name) { this.user.name = name; return this; }
    setEmail(email) { this.user.email = email; return this; }
    setPasswordHash(hash) { this.user.password_hash = hash; return this; }
    setRole(role) { this.user.role = role; return this; }
    setCreatedBy(userId) { this.user.created_by = userId; return this; }
    build() { return this.user; }
}

class UserRepository {
    async create(userObj) { return await User.create(userObj); }
    async findById(id) { return await User.findByPk(id); }
    async findAllByOrganization(orgId) { return await User.findAll({ where: { organization_id: orgId, active_flag: 1 } }); }
    async update(id, updateObj) {
        const user = await this.findById(id);
        if (!user) throw new Error('User not found');
        return await user.update(updateObj);
    }
    async softDelete(id) { return await this.update(id, { active_flag: 0 }); }
}

module.exports = { UserRepository, UserBuilder };
