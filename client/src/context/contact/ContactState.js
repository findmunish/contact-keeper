import React, { useReducer } from 'react';
// import uuid from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
    ADD_CONTACT,
    DELETE_CONTACT, 
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT, 
    FILTER_CONTACTS,
    CLEAR_FILTER
} from '../types';

const ContactState = props => {
    const initialState = {
        contacts: [
            {
                "id": "1",
                "name": "Ted Johnson",
                "email": "ted@gmail.com",
                "phone": "123-123-1244",
                "type": "personal",
            },
            {
                "id": "2",
                "name": "Sara Smith",
                "email": "sara@gmail.com",
                "phone": "121-121-1211",
                "type": "professional",
            },
            {
                "id": "3",
                "name": "Harry White",
                "email": "hwhite@gmail.com",
                "phone": "123-123-1233",
                "type": "professional",
            }
        ],
        current: null,
        filtered: null
    };

    const [state, dispatch] = useReducer(contactReducer, initialState);

    // Add Contact
    const addContact = contact => {
        contact.id = uuidv4();
        dispatch({ type: ADD_CONTACT, payload: contact });
    }

    // Delete Contact
    const deleteContact = id => {
        dispatch({ type: DELETE_CONTACT, payload: id });
    }

    // Set Current Contact
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact });
    }

    // Clear Current Contact
    const clearCurrent = contact => {
        dispatch({ type: CLEAR_CURRENT });
    }

    // Update Contact
    const updateCurrent = contact => {
        dispatch({ type: UPDATE_CONTACT, payload: contact });
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
                    addContact,
                    deleteContact,
                    setCurrent,
                    clearCurrent,
                    updateCurrent,
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