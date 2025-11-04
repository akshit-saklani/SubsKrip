// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/db');
const Organization = require('../models/organization');
const User = require('../models/user');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

exports.registerOrganization = async (req, res) => {
    const t = await sequelize.transaction();
    console.log(req.body);
    try {
        const { organization_name, name, email, password } = req.body;

        if (!organization_name || !name || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        // 1️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //check if organization exists with the same name
        const org_check = await Organization.findOne(
            {
                where:{
                    name:"organization_name"
                }
            }
        );
        if(org_check){
            return res.status(400).json({ message: 'This organization already exists. Please contact the admin.' });
        }

        // 2️⃣ Create organization
        const apiKey = uuidv4().replace(/-/g, '').slice(0, 32);
        const organization = await Organization.create({
            name: organization_name,
            api_key: apiKey,
            created_by: 0 // system placeholder until user created
        }, { transaction: t });

        // 3️⃣ Create admin user
        const adminUser = await User.create({
            organization_id: organization.id,
            name: name,
            email: email,
            password_hash: hashedPassword,
            role: 'admin',
            created_by: 0
        }, { transaction: t });

        // Update organization with created_by (admin user id)
        organization.created_by = adminUser.id;
        await organization.save({ transaction: t });

        await t.commit();

        req.flash('success_msg', 'Organization and admin registered successfully. Please log in.');
        return res.redirect('/login');
        // res.status(201).json({
        //     message: 'Organization and admin registered successfully',
        //     organization: { id: organization.id, name: organization.name, apiKey: organization.api_key },
        //     adminUser: { id: adminUser.id, email: adminUser.email }
        // });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error registering organization', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword)
            return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign(
            { id: user.id, orgId: user.organization_id, role: user.role },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        // NEW: Set the JWT as an HTTP-only, secure cookie
        res.cookie('jwt', token, {
            httpOnly: true, // Prevents client-side JS from reading the cookie
            secure: process.env.NODE_ENV === 'production', // Use 'true' in production (requires HTTPS)
            maxAge: 7 * 24 * 60 * 60 * 1000, // Matches the token expiration (7 days in milliseconds)
            sameSite: 'strict' // Recommended for CSRF protection
        });

        // res.status(200).json({
        //     message: 'Login successful',
        //     // NO 'token' FIELD HERE anymore. The token is in the cookie.
        //     user: {
        //         id: user.id,
        //         email: user.email,
        //         name: user.name,
        //         role: user.role,
        //         organization_id: user.organization_id
        //     }
        // });

        req.flash('success_msg', `Welcome back, ${user.name}!`);

        // Redirect to the home route
        return res.redirect('/home');

    } catch (error) {
        // res.status(500).json({ message: 'Login failed', error: error.message });
        console.error(error);
        req.flash('error', 'An internal server error occurred during login.');
        return res.redirect('/login');
    }
};
