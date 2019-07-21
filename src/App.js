import React, { Component } from 'react';
import './App.css';

const defaultStyle = {
  color: '#',
};
const fakeServerData = {
  user: {
    name: "Richard",
    playlists: [
      { 
        name: "Best Playlist",
        songs: [
          {
            name: "My Favorite Things", 
            duration: 1920
          },
          {
            name: "i", 
            duration: 1829
          },
          {
            name: "Slow Boat to China",
            duration: 1600
          }
        ]
      },
      {
        name: "Beatles 101",
        songs: [
          {
            name: "Revolution",
            duration: 1500
          },
          {
            name: "Hey Jude",
            duration: 1781
          },
          {
            name: "I Want to Hold Your Hand",
            duration: 1981
          }
        ]
      },
      {
        name: "Beatles 102",
        songs: [
          {
            name: "Honey Pie",
            duration: 1410
          },
          {
            name: "Maxwell's Silver Hammer",
            duration: 1102
          },
          {
            name: "Martha My Dear",
            duration: 1309
          }
        ]
      },
      {
        name: "The Black Keys Extravaganza",
        songs: [
          {
            name: "Lonely Boy",
            duration: 1629
          },
          {
            name: "Go",
            duration: 1777
          },
          {
            name: "Lo/Hi",
            duration: 1981
          }
        ]
      }
    ]
  }
};

class PlaylistCounter extends Component {
  render() {
    return(
      <div style={ {...defaultStyle, width: '40%', display: 'inline-block'} } >
        <h2 style={ {defaultStyle} }>{this.props.playlists.length} Playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    // reduce params:
    // 1. function
    // 2. initial state (in this case, empty list)
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return eachPlaylist.songs.concat(eachPlaylist.songs);
    }, []);
    const totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration;
    }, 0);
    return(
      <div style={ {...defaultStyle, width: '40%', display: 'inline-block'} } >
        <h2 style={ {defaultStyle} }>{Math.floor(totalDuration / 3600)} Hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    // input:
    // onChange attribute is an on-event handler that calls onTextChange().
    // onTextChange() is defined in the App component. It assigns text to
    // the App's filterString state.
    return(
      <div style={ {defaultStyle} }>
        <img alt="Filter" />
        <input type="text" onChange={ event => 
          this.props.onTextChange(event.target.value) 
        }/>
        Filter
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return(
      <div style={ {...defaultStyle, width: '25%', display: 'inline-block'} }>
        <img src="" alt=""/>
        <h3>{ this.props.playlist.name }</h3>
        <ul>
          {this.props.playlist.songs.map( song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }

  componentDidMount() {
    setTimeout( () =>
      this.setState({
        serverData: fakeServerData
      }), 1000
    );
  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?    // checks if server data exists,
                                         // renders the following JSX if true
        <div>
          <h1 style={ {...defaultStyle, "font-size": "54px"} }>
            {this.state.serverData.user.name}'s Playlist
          </h1>
          <PlaylistCounter playlists={this.state.serverData.user.playlists} />
          <HoursCounter playlists={this.state.serverData.user.playlists} />
          <Filter onTextChange={ text => this.setState({    // onTextChange() assigns received text to the filterString state
            filterString: text
          }) } />
          { // Filtering logic
            this.state.serverData.user.playlists.filter(playlist =>    // Array.filter() creates a new array of elements
              playlist.name.toLowerCase().includes(                    // that respond 'true' to the return statement
                this.state.filterString.toLowerCase())          
            ).map(playlist =>     // Array.map() calls the provided callback function on each element in the array
              <Playlist playlist={playlist} />
            )
          }
        </div> : <h1 style={defaultStyle}>Loading!</h1>
        }
      </div>
    );
  }
}

export default App;
