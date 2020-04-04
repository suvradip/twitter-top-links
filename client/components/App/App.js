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
      };
   }

   componentDidMount() {
      const { page } = this.state;
      Promise.all([apiAgent.tweets.getAll(page)]).then(([val]) => this.setState({ tweets: val.data }));
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

   render() {
      const { tweets, enableBtn } = this.state;
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
                     <h5 className='small-heading'>Most active</h5>
                     <MediaListItems />
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
                     <ListItems />
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

export default App;
