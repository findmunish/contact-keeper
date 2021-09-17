const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Contact = require('../models/Contact');
const CONSTANTS = require('../constants/constants');
const ERRORS = require('../constants/errors');

// @route   GET api/contacts
// @desc    Get all user contacts for the given user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error getting contacts: ', error.message);
        res.status(500).send(ERRORS.RETURN.SERVER_ERROR);
    }
});

validationBodyRules = [
    body('name', ERRORS.USERS.NAME_VALIDATION).not().isEmpty(),
    body('email', ERRORS.USERS.EMAIL_VALIDATION).isEmail(),
];

const checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post('/', auth, validationBodyRules, checkRules, async (req, res) => {
    const { name, email, phone, type } = req.body;

    try {
        const newContact = new Contact({name, email, phone, type, user: req.user.id });

        const contact = await newContact.save();

        return res.json(contact);
    } catch (error) {
        console.error('Error saving a new contact: ', error.message);
        res.status(500).send(ERRORS.RETURN.SERVER_ERROR);
    }
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, type } = req.body;

    // Build contact object
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
        let contact = await Contact.findById( req.params.id );
        if (!contact) res.status(404).json({ msg: ERRORS.CONTACTS.NOT_FOUND })

        // Make sure the user owns the contact
        if (contact.user.toString() !== req.user.id) {
            res.status(401).json({ msg: ERRORS.CONTACTS.NOT_AUTHORIZED })
        }

        await Contact.findByIdAndRemove( req.params.id );
        res.json({ msg: 'Contact is removed successfully' });
    } catch (error) {
        console.error('Error editing an existing contact: ', error.message);
        res.status(500).send(ERRORS.RETURN.SERVER_ERROR);
    }
});

// @route   Delete api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let contact = await Contact.findById( req.params.id );
        if (!contact) res.status(404).json({ msg: ERRORS.CONTACTS.NOT_FOUND })

        // Make sure the user owns the contact
        if (contact.user.toString() !== req.user.id) {
            res.status(401).json({ msg: ERRORS.CONTACTS.NOT_AUTHORIZED })
        }

        contact = await Contact.findByIdAndRemove(req.params.id) ;
        res.json({ msg: ERRORS.CONTACTS.DELETE_SUCCESS });
    } catch (error) {
        console.error('Error deleting an existing contact: ', error.message);
        res.status(500).send(ERRORS.RETURN.SERVER_ERROR);
    }
});
module.exports = router;