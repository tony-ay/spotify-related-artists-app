import _ from 'lodash';
import axios from 'axios';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import SearchBar from './components/search_bar';
import ArtistList from './components/artist_list';

export const ROOT_URL = 'https://api.spotify.com';

// Create a new component. This component should produce
// some HTML.
class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
         authToken: null,
         relatedArtists: [],
         selectedArtist: null
      };
   }

   componentWillMount() {
      axios.get('http://localhost:3000/token')
         .then((response) => {
            this.setState({
               authToken: response.data.token
            });
            this.artistSearch('Drake');
         })
         .catch((error) => {
            console.log(error);
         });
   }

   artistSearch(term) {
      const url = `${ROOT_URL}/v1/search?q=${term}&type=artist&market=US&limit=10`;
      axios.get(url, {
         headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${this.state.authToken}`
         }})
         .then((response) => {
            const artist = response.data.artists.items[0]
            this.setState({
               selectedArtist: artist
            });
            this.getRelatedArtists(artist.id);
         })
         .catch((error) => {
            console.log(error);
         });
   }

   getRelatedArtists(id) {
      const url = `${ROOT_URL}/v1/artists/${id}/related-artists`;
      axios.get(url, {
         headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${this.state.authToken}`
         }})
         .then((response) => {
            this.setState({
               relatedArtists: response.data.artists
            });
         });
   }

   onArtistSelect(artist) {
      this.getRelatedArtists(artist.id);
      this.setState({
         selectedArtist: artist
      });
   }

   render() {
      let listTitle;
      if (this.state.selectedArtist) {
         listTitle =
            <div className="center-text">
               <h2>
                  Related artists for {this.state.selectedArtist.name}
               </h2>
            </div>;
      } else {
         listTitle = null;
      }

      return (
         <div>
            <SearchBar onSearchTermSubmit={this.artistSearch.bind(this)} />
            <div className="artist-list">
               {listTitle}
               <ArtistList
                  onArtistSelect={this.onArtistSelect.bind(this)}
                  authToken={this.state.authToken}
                  artists={this.state.relatedArtists} />
            </div>
         </div>
      );
   }
}

// Take this compnonent's generated HTML and put it
// on the page (in the DOM)
ReactDOM.render(<App />, document.querySelector('.container'));
