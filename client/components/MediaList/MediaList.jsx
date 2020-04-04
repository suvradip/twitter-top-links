import React from 'react';
import './MediaList.scss';

const MediaList = () => {
   return (
      <ul className='list-unstyled'>
         <li className='media'>
            <img src='https://i.pravatar.cc' className='mr-3' alt='...' />
            <div className='media-body'>
               <h6 className='mt-0 mb-1'>@ashis</h6>
               <p className='small-text'>shared 22 links</p>
            </div>
         </li>
         <li className='media my-4'>
            <img src='https://i.pravatar.cc' className='mr-3' alt='...' />
            <div className='media-body'>
               <h6 className='mt-0 mb-1'>@alex</h6>
               <p className='small-text'>shared 22 links</p>
            </div>
         </li>
      </ul>
   );
};

export default MediaList;
