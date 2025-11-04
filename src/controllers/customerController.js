const Customer = require('../models/customer');

// Get all customers for an organization
exports.getAllCustomers = async (req, res) => {
    try {
        const orgId = req.user?.organization_id || 1;

        const customers = await Customer.findAll({
            where: { organization_id: orgId },
            order: [['id', 'ASC']],
        });

        res.json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

// Add a new customer
exports.addCustomer = async (req, res) => {
    try {
        const orgId = req.user?.organization_id || 1;
        const { customer_type, name, email, phone } = req.body;

        const newCustomer = await Customer.create({
            organization_id: orgId,
            customer_type,
            name,
            email,
            phone,
            created_by: req.user?.id || 1,
        });

        res.status(201).json(newCustomer);
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(500).json({ error: 'Failed to create customer' });
    }
};

// Update existing customer
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, customer_type } = req.body;

        const customer = await Customer.findByPk(id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        await customer.update({ name, email, phone, customer_type });
        res.json(customer);
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ error: 'Failed to update customer' });
    }
};

// Enable/Disable customer
exports.toggleCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        const newStatus = customer.active_flag ? 0 : 1;
        await customer.update({
            active_flag: newStatus,
            status: newStatus ? 'active' : 'inactive',
        });

        res.json(customer);
    } catch (err) {
        console.error('Error toggling customer:', err);
        res.status(500).json({ error: 'Failed to toggle customer status' });
    }
};
