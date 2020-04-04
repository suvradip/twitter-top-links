import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.scss';

const SearchBar = ({ action }) => {
   const [value, setValue] = useState('');

   const btnAction = (event) => {
      event.preventDefault();
      action(value.split(' ').join(','));
   };

   const handleChange = (event) => {
      const targetValue = event.target.value;
      if (targetValue === '') {
         action();
      }
      setValue(targetValue);
   };

   return (
      <form onSubmit={btnAction}>
         <div className='input-group search-bar'>
            <input type='text' className='form-control' placeholder='Search ...' onChange={handleChange} />
            <div className='input-group-append'>
               <button type='submit' className='input-group-text' onClick={btnAction}>
                  search
               </button>
            </div>
         </div>
      </form>
   );
};

SearchBar.propTypes = {
   action: PropTypes.func.isRequired,
};

export default SearchBar;
