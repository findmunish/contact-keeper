const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// const config = require('config');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const CONSTANTS = require('../constants/constants');
const ERRORS = require('../constants/errors');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(`Error getting loggen in user details:`, error.message);
        res.status(500).send(ERRORS.RETURN.SERVER_ERROR);
    }
});

validationBodyRules = [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter the password').exists()
];

const checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

// @route   POST api/auth
// @desc    Auth user and get token
// @access  Public
router.post('/', validationBodyRules, checkRules, async (req, res) => {
   const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: ERRORS.AUTH.INVALID_CREDENTIALS });
        }

        const isMatch = await bcrypt.compare (password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: ERRORS.AUTH.INVALID_CREDENTIALS })
        }

        const payload = {
            user: { id: user.id }
        }

        jwt.sign(payload, user.jwtSecret, {
            expiresIn: CONSTANTS.JWT_AUTH.EXPIRES_IN_SEC,
        }, (error, token) => {
            if (error) throw error;
            res.json({ token, email });
        });
    } catch (error) {
        console.error('Error in user login: ', error.message);
        res.status(500).send(ERRORS.RETURN.SERVER_ERROR);
    }
});

module.exports = router;