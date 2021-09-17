const jwt = require('jsonwebtoken');
// const config = require('config');
const User = require('../models/User');
const CONSTANTS = require('../constants/constants');
const ERRORS = require('../constants/errors');

const authenticateUser = async (req, res, next) => {
    // Get the token from the header
    const token = req.header(CONSTANTS.JWT_AUTH.AUTH_TOKEN_HEADER);
    const email = req.header(CONSTANTS.JWT_AUTH.EMAIL_HEADER);
    // Check if not token
    if (!token || !email) {
        return res.status(401).json({ msg: ERRORS.MIDDLEWARE_AUTH.NO_TOKEN_ERROR });
    }
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: ERRORS.MIDDLEWARE_AUTH.INVALID_EMAIL });
        }

        const decoded = jwt.verify( token, user.jwtSecret/*config.get(JWT_SECRET_TOKEN_KEY)*/ );
        req.user = decoded.user;

        next();
    } catch (error) {
        res.status(401).json({ msg: ERRORS.MIDDLEWARE_AUTH.INVALID_TOKEN })
    }
}

module.exports = authenticateUser;
