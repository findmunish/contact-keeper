import axios from 'axios';

const setAuthToken = tokenData => {
    if (tokenData) {
        axios.defaults.headers.common['x-auth-token'] = tokenData.token;
        axios.defaults.headers.common['email'] = tokenData.email;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
        delete axios.defaults.headers.common['email'];
    }
}
export default setAuthToken;