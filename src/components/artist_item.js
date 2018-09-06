import React, { Component } from 'react';
import axios from 'axios';

import { ROOT_URL } from '../index.js';

class ArtistItem extends Component {
   constructor(props) {
      super(props);

      this.state = {
         songUrl: null
      }
   }

   componentDidMount() {
      this.getTopSong();
   }

   getTopSong() {
      const url = `https://api.spotify.com/v1/artists/${this.props.artist.id}/top-tracks`

      axios.get(url, {
         params: {
            market: 'us'
         },
         headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${this.props.authToken}`
         }})
         .then((response) => {
            let songId;
            let url;
            if (response.data.tracks[0]) {
               songId = response.data.tracks[0].id;
               url = `https://open.spotify.com/embed/track/${songId}`;
            } else {
               url = null;
            }
            this.setState({
               songUrl: url
            })
         })
         .catch((error) => {
            console.log(error);
         });
   }

   render() {
      const artist = this.props.artist;

      let songPreview;
      if (this.state.songUrl) {
         songPreview = <div className="embed-responsive embed-responsive-21by9">
               <iframe className="embed-responsive-item" src={this.state.songUrl}></iframe>
            </div>
      } else {
         songPreview = null;
      }

      let artistImage;
      if (artist.images[0]) {
         artistImage = <div className="media-left">
            <img className="media-object" src={artist.images[0].url} />
         </div>
      } else {
         artistImage = null;
      }

      return (
         <li onClick={() => this.props.onArtistSelect(artist)} className="list-group-item">
            <div className="artist-item media">
               {artistImage}
               <div className="media-body">
                  <h4>{artist.name}</h4>
                  <div>
                     Genres: {artist.genres.map((genre) => {return `${genre}, `;})}
                  </div>
                  <div>{songPreview}</div>
               </div>
            </div>
         </li>
      );
   }
}

export default ArtistItem;
