import React from 'react';
import logo from '../../images/logo.svg';
import './Navbar.scss';
import apiAgent from '../../util/api';

const Navbar = () => {
   const logoutAction = () => {
      window.localStorage.removeItem('twitterUserName');
      const isProd = process.env.NODE_ENV === 'production';
      apiAgent.users.logout();
      window.location.href = isProd ? '/api/v1/auth/' : `http://localhost:8080/api/v1/auth/`;
   };

   return (
      <nav className='navbar navbar-light bg-light'>
         <a href='/'>
            <img src={logo} width='auto' height='60px' alt='demo logo' />
         </a>
         <button type='button' className='btn btn-outline-dark' onClick={logoutAction}>
            Logout{' '}
         </button>
      </nav>
   );
};

export default Navbar;
