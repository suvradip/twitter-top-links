import React from 'react';
import PropTypes from 'prop-types';
import './List.scss';

const List = ({ data }) => {
   return (
      <ul className='list-group'>
         {data.map(([link, count], index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li className='list-group-item' key={index}>
               <a className='domain' href={link} target='_blank' rel='noopener noreferrer' title={link}>
                  {link}{' '}
               </a>
               <span className='badge badge-primary badge-pill'>{count}</span>
            </li>
         ))}
      </ul>
   );
};

List.propTypes = {
   data: PropTypes.array.isRequired,
};

export default List;
