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

   componentWillMount() {
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
            const songId = response.data.tracks[0].id;
            const url = `https://open.spotify.com/embed/track/${songId}`
            this.setState({
               songUrl: url
            });
         });
   }

   render() {
      let songPreview;
      if (this.state.songUrl) {
         songPreview = <div className="embed-responsive embed-responsive-21by9">
               <iframe className="embed-responsive-item" src={this.state.songUrl}></iframe>
            </div>
      } else {
         songPreview = null;
      }

      const artist = this.props.artist;

      return (
         <li onClick={() => this.props.onArtistSelect(artist)} className="list-group-item">
            <div className="artist-item media">
               <div className="media-left">
                  <img className="media-object" src={artist.images[0].url} />
               </div>
               <div className="media-body">
                  {artist.name}
                  <div>
                     {songPreview}
                  </div>
               </div>
            </div>
         </li>
      );
   }
}

export default ArtistItem;
