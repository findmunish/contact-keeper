const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', (req, res) => {
    res.send('Get loggedin user');
});

// @route   POST api/auth
// @desc    Auth user and get token
// @access  Public
router.post('/', (req, res) => {
    res.send('Login a user');
});

module.exports = router;