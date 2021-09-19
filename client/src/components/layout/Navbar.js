import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';

const Navbar = ({ title, icon }) => {
    const authContext = useContext (AuthContext);

    const { isAuthenticated, logout, user } = authContext;

    const onLogout = e => {
        logout();
    };

    const authLinks = (
        <Fragment>
            <li>Hello { user && user.name } </li>
            <li>
                <a onClick={onLogout} href="#!">
                    <i className="fas fa-sign-out-alt" /> <span className="hide-sm">Logout</span>
                </a>
            </li>
        </Fragment>
    );

    const guestLinks = (
        <Fragment>
            <Link to='/register'>
                <i className="fas fa fa-user-plus" /> <span className="hide-sm">Register</span>
            </Link>
           <Link to='/login'>
                <i className="fas fa fa-sign-in-alt" /> <span className="hide-sm">Login</span>
           </Link>
        </Fragment>
    );

    return (
        <div className="navbar bg-primary">
            <h1>
                <i className={icon} /> {title}
            </h1>
            <ul>
                {/* <li> <Link to='/'>Home</Link> </li> */}
                {/* <li> <Link to='/'>About</Link> </li> */}
                {isAuthenticated ? authLinks : guestLinks }
            </ul>
        </div>
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
};

Navbar.defaultProps = {
    title: 'Contact Keeper',
    icon: 'fas fa-id-card-alt'
};

export default Navbar;