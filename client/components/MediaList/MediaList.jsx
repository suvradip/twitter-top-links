import React from 'react';
import PropTypes from 'prop-types';
import './MediaList.scss';
import profileImage from '../../images/profile.png';

const MediaList = ({ data }) => {
   return (
      <ul className='list-unstyled'>
         {data.map(([name, extra], index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li className='media' key={index}>
               <a
                  href={`https://twitter.com/${name}`}
                  className='linkWrapper'
                  target='_blank'
                  rel='noopener noreferrer'
               >
                  <img src={extra.image || profileImage} className='mr-3' alt='...' />
                  <div className='media-body'>
                     <h6 className='mt-0 mb-1'>{name}</h6>
                     <p className='small-text'>shared {extra.count} links</p>
                  </div>
               </a>
            </li>
         ))}
      </ul>
   );
};

MediaList.propTypes = {
   data: PropTypes.array.isRequired,
};

export default MediaList;
