import React from 'react';
import logo from '../../images/logo.svg';

const Navbar = () => {
   return (
      <nav className='navbar navbar-light bg-light'>
         <img src={logo} width='auto' height='60px' alt='demo logo' />
      </nav>
   );
};

export default Navbar;
