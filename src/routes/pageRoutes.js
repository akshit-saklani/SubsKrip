const express = require('express');
const User = require('../models/user');
const Customer = require('../models/customer');
const router = express.Router();

// Render Manage Team page
router.get('/team', async (req, res) => {
    try {
        // Assuming organization_id comes from logged-in user (via session/JWT)
        const orgId = req.user?.organization_id || 1;

        // Fetch all team members from DB
        const teamMembers = await User.findAll({
            where: { organization_id: orgId },
            attributes: ['id', 'name', 'email', 'role', 'active_flag'],
            order: [['id', 'ASC']]
        });

        // Transform data to match your EJS expectations (rename active_flag → active)
        const formattedMembers = teamMembers.map(member => ({
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
            active: member.active_flag === 1
        }));

        res.render('team', {
            title: 'Manage Team',
            teamMembers: formattedMembers
        });

    } catch (err) {
        console.error('Error rendering team page:', err);
        res.status(500).send('Error loading team page');
    }
});

router.get('/customers', async (req, res) => {
    try {
        const orgId = req.user?.organization_id || 1;
        const customers = await Customer.findAll({
            where: { organization_id: orgId },
            order: [['id', 'ASC']],
        });

        res.render('customers', {
            title: 'Manage Customers',
            customers: customers.map(c => ({
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                type: c.customer_type,
                status: c.status,
                active: c.active_flag === 1
            }))
        });
    } catch (err) {
        console.error('Error rendering customer page:', err);
        res.status(500).send('Failed to load customers');
    }
});

module.exports = router;
