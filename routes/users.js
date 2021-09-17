const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
// const cryptoRandomString = require('crypto-random-string');
const jwt = require('jsonwebtoken');
// const config = require('config');
const User = require('../models/User');
const CONSTANTS = require('../constants/constants');
const ERRORS = require('../constants/errors');

const router = express.Router();

validationBodyRules = [
    body('name', ERRORS.USERS.NAME_VALIDATION).not().isEmpty(),
    body('email', ERRORS.USERS.EMAIL_VALIDATION).isEmail(),
    body('password', ERRORS.USERS.PASSWORD_VALIDATION).isLength({ min: CONSTANTS.USER.PASSWORD_MIN_LEN })
];

const checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

// @route   POST api/users
// @desc    register a user
// @access  Public
router.post('/', validationBodyRules, checkRules, async (req, res, next) => {
    const {name, email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ msg: ERRORS.USERS.USER_EXISTS })
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt( CONSTANTS.USER.SALT_VALUE );
        user.password = await bcrypt.hash(password, salt)

        // user.jwtSecret = cryptoRandomString({ length: CONSTANTS.RANDOM_STR.CRYPTO_RANDOM_STRING_LEN, type: CONSTANTS.RANDOM_STR.CRYPTO_RANDOM_TYPE_ALPHANUMERIC });
        user.jwtSecret = Math.random().toString(CONSTANTS.RANDOM_STR.BASE_36_STR).slice(CONSTANTS.RANDOM_STR.SKIP_CHARS_IN_BASE_36);
        // user.jwtSecret = config.get(CONSTANTS.JWT_AUTH.JWT_SECRET_TOKEN_KEY);

        await user.save();

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
        console.error('Error registering user: ', error.message);
        res.status(500).send(ERRORS.RETURN.SERVER_ERROR);
    }
});
module.exports = router;