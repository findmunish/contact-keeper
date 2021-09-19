import React, { useReducer } from 'react';
import axios from 'axios';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
    GET_CONTACTS,
    ADD_CONTACT,
    DELETE_CONTACT, 
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT, 
    FILTER_CONTACTS,
    CLEAR_CONTACTS,
    CLEAR_FILTER,
    CONTACT_ERROR
} from '../types';

const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null,
        filtered: null,
        error: null
    };

    const [state, dispatch] = useReducer(contactReducer, initialState);

    // Get Contacts
    const getContacts = async () => {
        try {
            const response = await axios.get('/api/contacts');

            dispatch({ type: GET_CONTACTS, payload: response.data });
        } catch (error) {
            dispatch({ type: CONTACT_ERROR, payload: error });
        }
    }

    // Get Contacts
    const addContact = async contact => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await axios.post('/api/contacts', contact, config);

            dispatch({ type: ADD_CONTACT, payload: response.data });
        } catch (error) {
            dispatch({ type: CONTACT_ERROR, payload: error.response.data.msg });
        }
    }

    // Delete Contact
    const deleteContact = async _id => {
        try {
            await axios.delete(`/api/contacts/${_id}`);

            dispatch({ type: DELETE_CONTACT, payload: _id });
        } catch (error) {
            dispatch({ type: CONTACT_ERROR, payload: error.response.data.msg });
        }
    }

    // Update Contact
    const updateContact = async contact => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await axios.put(`/api/contacts/${contact._id}`, contact, config);

            dispatch({ type: UPDATE_CONTACT, payload: response.data });
        } catch (error) {
            dispatch({ type: CONTACT_ERROR, payload: error.response.data.msg });
        }
    }

    // Clear contacts
    const clearContacts = () => {
        dispatch({ type: CLEAR_CONTACTS })
    }

    // Set Current Contact
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact });
    }

    // Clear Current Contact
    const clearCurrent = contact => {
        dispatch({ type: CLEAR_CURRENT });
    }

    // Filter Contacts
    const filterContacts = text => {
        dispatch({ type: FILTER_CONTACTS, payload: text });
    }

    // Clear Filter
    const clearFilter = text => {
        dispatch({ type: CLEAR_FILTER });
    }

    return (
        <ContactContext.Provider
            value={
                {
                    contacts: state.contacts,
                    current: state.current,
                    filtered: state.filtered,
                    error: state.error,
                    getContacts,
                    addContact,
                    deleteContact,
                    updateContact,
                    clearContacts,
                    setCurrent,
                    clearCurrent,
                    filterContacts,
                    clearFilter
                }
            }
        >
            { props.children }
        </ContactContext.Provider>
    )
}
export default ContactState;