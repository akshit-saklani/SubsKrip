const jwt = require('jsonwebtoken');

// NOTE: In a real app, this should be loaded from your .env file
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey'; 

/**
 * Middleware to check for the JWT in an HTTP-only cookie and verify it.
 * If successful, it attaches the decoded user payload to req.user.
 */
exports.protect = (req, res, next) => {
    // 1. Get token from the cookie object, parsed by 'cookie-parser'
    const token = req.cookies.jwt; 

    if (!token) {
        // No token means the user is not authenticated
        console.log('Access denied: No JWT cookie found.');
        return res.status(401).json({ message: 'Not authenticated, please log in.' });
    }

    try {
        // 2. Verify and decode the token using the secret key
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 3. Attach the verified payload (id, orgId, role) to the request object
        req.user = decoded; 
        
        // Proceed to the next middleware or route handler
        next(); 
    } catch (error) {
        // Token is invalid (expired, corrupted, or bad signature)
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ message: 'Not authorized, token is invalid or expired.' });
    }
};
