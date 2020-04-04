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
   if (dayDiff !== 0) {
      time = `${dayDiff} days ago`;
   } else if (hoursDiff !== 0) {
      time = `${hoursDiff} hours ago`;
   } else {
      time = `${minutesDiff} minutes ago`;
   }

   const dp = typeof image !== 'undefined' ? image : profileImage;

   return (
      <div className='card'>
         <div className='card-body'>
            <div className='dp mb-3'>
               <img src={dp} className='card-img' alt='' />
               <div className='user-info'>
                  <h5 className='card-title'>{data.name}</h5>
                  <h6> @{data.tweetPostedBy} </h6>
               </div>
            </div>

            <div className='card-text'>
               <pre className='contents'>{data.text}</pre>
            </div>
            <p className='text-right'>
               <span> {time}</span>
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
   }),
};

Card.defaultProps = {
   data: {},
};

export default Card;
