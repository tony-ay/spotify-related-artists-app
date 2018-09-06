import React, { Component } from 'react';

import ArtistListItem from './artist_item';

const ArtistList = (props) => {
   const artistItems = props.artists.map((artist) => {
      return (
         <ArtistListItem
            key={artist.id}
            onArtistSelect={props.onArtistSelect}
            artist={artist}
            authToken={props.authToken} />
      );
   });

   return (
      <ul className="col-md-12">
         {artistItems}
      </ul>
   );
}

export default ArtistList;
