/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import './App.scss';
import Navbar from '../Navbar/Navbar';
import Card from '../Card/Card';
import ListItems from '../List/List';
import MediaListItems from '../MediaList/MediaList';
import apiAgent from '../../util/api';

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         tweets: [],
         page: 0,
         enableBtn: true,
         topUsers: [],
         topDomains: [],
         hasScrolled: false,
      };
   }

   componentDidMount() {
      const { page } = this.state;
      const promises = [apiAgent.tweets.getAll(page), apiAgent.users.getAll()];
      Promise.all(promises).then(([tweetsData, userData]) =>
         this.setState({
            tweets: tweetsData.data,
            topUsers: userData.data.topUsers,
            topDomains: userData.data.topLinks,
         })
      );

      window.addEventListener('scroll', this.onScroll);
   }

   actionLoadMore = () => {
      this.setState(
         (state) => ({ page: state.page + 1 }),
         () => {
            const { page, tweets } = this.state;
            Promise.all([apiAgent.tweets.getAll(page)]).then(([val]) =>
               this.setState({ tweets: tweets.concat(val.data), enableBtn: val.count !== 0 })
            );
         }
      );
   };

   onScroll = () => {
      const position = document.body.scrollTop || document.documentElement.scrollTop;

      const { hasScrolled } = this.state;
      if (position > 400 && !hasScrolled) {
         this.setState({ hasScrolled: true });
      } else if (position < 400 && hasScrolled) {
         this.setState({ hasScrolled: false });
      }
   };

   gotoTop = () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
   };

   render() {
      const { tweets, enableBtn, topUsers, topDomains, hasScrolled } = this.state;
      const LoadMoreBtn = () => {
         return (
            <p className='text-center'>
               <button className='btn btn-outline-secondary' type='button' onClick={this.actionLoadMore}>
                  LOAD MORE TWEETS
               </button>
            </p>
         );
      };
      return (
         <div className='container-fluid'>
            <Navbar />
            <div className='container'>
               <div className='row'>
                  <div className='col-3'>
                     <div className='most-active-user'>
                        <h5 className='small-heading'>Most active</h5>
                        <MediaListItems data={topUsers} />
                     </div>
                  </div>
                  <div className='col-6'>
                     <div className='tweets-wrapper'>
                        <div className='tweets'>
                           {tweets.map((item) => (
                              <Card data={item} key={item._id} />
                           ))}
                        </div>

                        {enableBtn && <LoadMoreBtn />}

                        {!enableBtn && <div className='alert alert-info text-center'>No more tweets to load.</div>}
                     </div>
                  </div>
                  <div className='col-3'>
                     <h5 className='small-heading'>Trending domains</h5>
                     <ListItems data={topDomains} />
                  </div>
               </div>
               <p>
                  {hasScrolled && (
                     <button type='button' className='btn-gotoTop btn btn-secondary' onClick={this.gotoTop}>
                        &uarr;
                     </button>
                  )}
               </p>
            </div>
         </div>
      );
   }
}

export default App;
