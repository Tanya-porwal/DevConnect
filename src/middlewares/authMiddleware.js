const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (!token && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        if (req.accepts('html')) return res.redirect('/login');
        return res.status(401).json({ success: false, message: 'Please log in' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        if (req.accepts('html')) return res.redirect('/login');
        return res.status(401).json({ success: false, message: 'Invalid session' });
    }
};

module.exports = { protect };
