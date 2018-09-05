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
            <div>
               <h4>
                  Related artists for {this.state.selectedArtist.name}
               </h4>
            </div>;
      } else {
         listTitle = null;
      }

      return (
         <div>
            <SearchBar onSearchTermSubmit={this.artistSearch.bind(this)} />
            <h1>
               {listTitle}
            </h1>
            <ArtistList
               onArtistSelect={this.onArtistSelect.bind(this)}
               authToken={this.state.authToken}
               artists={this.state.relatedArtists} />
         </div>
      );
   }
}

// Take this compnonent's generated HTML and put it
// on the page (in the DOM)
ReactDOM.render(<App />, document.querySelector('.container'));
