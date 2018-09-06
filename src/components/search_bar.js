import React, { Component } from 'react';

class SearchBar extends Component {
   constructor(props) {
      super(props);

      this.state = { term: '' };
   }

   render() {
      return (
         <div className="search-bar">
            <input
               value={this.state.term}
               onChange={event => this.onInputChange(event.target.value)}
               placeholder="Search for an artist" />
            <button onClick={event => this.onInputSubmit(this.state.term)}>
               Search
            </button>
         </div>
      );
   }

   onInputChange(term) {
      this.setState({term});
   }

   onInputSubmit(term) {
      this.props.onSearchTermSubmit(term);
   }
}

export default SearchBar;
