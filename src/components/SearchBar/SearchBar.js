import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    // sets the initial state with no search term
    this.state = { term: '' };

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // triggers a search when the user presses Enter
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.search();
    }
  }

  // updates the
  handleTermChange(e) {
    this.setState({
      term: e.target.value
    });
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return(
      <div className="SearchBar">
        <input id="SearchBar-input"
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
          onKeyPress={this.handleKeyPress} />
        <button
          className="SearchButton"
          onClick={this.search}>
          SEARCH
        </button>
      </div>
    );
  }
};

export default SearchBar;
