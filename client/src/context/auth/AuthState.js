import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL, 
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types';
const BASE_URL = 'http://localhost:5000';
const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('tokenData') ? JSON.parse(localStorage.getItem('tokenData')).token : null,
        isAuthenticated: null,
        loading: true,
        user: null,
        error: null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {
        if (localStorage.tokenData) {
            setAuthToken(JSON.parse(localStorage.tokenData));
        }
        try {
            // const response = await axios.get('/api/auth');
            const response = await axios.get(`${BASE_URL}/api/auth`);
            dispatch({ type: USER_LOADED, payload: response.data });

        } catch(error) {
            dispatch({ type: AUTH_ERROR });
        }
    }

    // Register User
    const register = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            // const response = await axios.post('/api/users', formData, config);
            const response = await axios.post(`${BASE_URL}/api/users`, formData, config);
            dispatch({ type: LOGIN_SUCCESS, payload: response.data });

            await loadUser();
        } catch (error) {
            dispatch({ type: LOGIN_FAIL, payload: error.response.data.msg })
        }
    }

    // Login User
    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            // const response = await axios.post('/api/auth', formData, config);
            const response = await axios.post(`${BASE_URL}/api/auth`, formData, config);
            dispatch({ type: REGISTER_SUCCESS, payload: response.data });

            await loadUser();
        } catch (error) {
            dispatch({ type: REGISTER_FAIL, payload: error })
        }
    }

    // Logout
    const logout = () => dispatch({ type: LOGOUT })

    // Clear Errors
    const clearErrors = () => dispatch({ type: CLEAR_ERRORS })

    return (
        <AuthContext.Provider
            value={
                {
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
                    loading: state.loading,
                    user: state.user,
                    error: state.error,
                    loadUser,
                    register,
                    login,
                    logout,
                    clearErrors
                }
            }
        >
            { props.children }
        </AuthContext.Provider>
    )
}

export default AuthState;