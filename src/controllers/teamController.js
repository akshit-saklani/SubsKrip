// controllers/teamController.js
const User = require('../models/user');
const Organization = require('../models/organization');

module.exports = {
  // GET /team
  async getAllTeamMembers(req, res) {
    try {
      // Assuming org_id comes from logged-in user (session or JWT)
      const orgId = req.user?.organization_id || 1; // fallback for demo
      const teamMembers = await User.findAll({
        where: { organization_id: orgId },
        attributes: ['id', 'name', 'email', 'role', 'active_flag']
      });
      res.json(teamMembers);
    } catch (err) {
      console.error('Error fetching team:', err);
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  },

  // POST /team
  async createTeamMember(req, res) {
    try {
      const orgId = req.user?.organization_id || 1;
      const creatorId = req.user?.id || 1;
      const { name, email, role } = req.body;

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const newUser = await User.create({
        organization_id: orgId,
        name,
        email,
        role,
        password_hash: 'TEMP', // You’ll hash real password later
        created_by: creatorId
      });

      res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating member:', err);
      res.status(500).json({ error: 'Failed to create member' });
    }
  },

  // PUT /team/:id
  async updateTeamMember(req, res) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const member = await User.findByPk(id);
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      await member.update({ name, email, role });
      res.json(member);
    } catch (err) {
      console.error('Error updating member:', err);
      res.status(500).json({ error: 'Failed to update member' });
    }
  },

  // PATCH /team/:id/toggle
  async toggleTeamMember(req, res) {
    try {
      const { id } = req.params;
      const member = await User.findByPk(id);
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      const newStatus = member.active_flag ? 0 : 1;
      await member.update({ active_flag: newStatus });
      res.json({ id: member.id, active_flag: newStatus });
    } catch (err) {
      console.error('Error toggling member:', err);
      res.status(500).json({ error: 'Failed to toggle member' });
    }
  }
};
