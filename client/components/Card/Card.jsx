import React from 'react';
import PropTypes from 'prop-types';
import profileImage from '../../images/profile.png';

import './Card.scss';

const { differenceInHours, differenceInCalendarDays, differenceInMinutes } = require('date-fns');

const Card = ({ data }) => {
   const { createdAt, image } = data;
   const date = new Date(createdAt);
   const today = new Date();

   const dayDiff = differenceInCalendarDays(today, date);
   const hoursDiff = differenceInHours(today, date);
   const minutesDiff = differenceInMinutes(today, date);

   let time;
   if (minutesDiff < 60) {
      time = `${minutesDiff} minutes ago`;
   } else if (hoursDiff < 24) {
      time = `${hoursDiff} hours ago`;
   } else {
      time = `${dayDiff} days ago`;
   }

   const dp = typeof image !== 'undefined' ? image : profileImage;

   return (
      <div className='card'>
         <div className='card-body'>
            <div className='dp mb-3'>
               <img src={dp} className='card-img' alt='' />
               <div className='user-info'>
                  <h5 className='card-title'>{data.name}</h5>
                  <h6>
                     <a rel='noopener noreferrer' target='_blank' href={`https://twitter.com/${data.tweetPostedBy}`}>
                        @{data.tweetPostedBy}
                     </a>{' '}
                  </h6>
               </div>
            </div>

            <div className='card-text'>
               <pre className='contents'>{data.text}</pre>
            </div>
            <p className='hashtags'>{data.hashtags.map((h) => `${h}`).join(' ')}</p>
            <p className='footer-items'>
               <a
                  href={data.urls[0].expandedURL}
                  className='btn btn-primary btn-sm'
                  rel='noopener noreferrer'
                  target='_blank'
               >
                  View
               </a>

               <span className='text-right'> {time}</span>
            </p>
         </div>
      </div>
   );
};

Card.propTypes = {
   data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      tweetPostedBy: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      image: PropTypes.string,
      urls: PropTypes.array,
      hashtags: PropTypes.array,
   }),
};

Card.defaultProps = {
   data: {},
};

export default Card;
