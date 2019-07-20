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
      return eachPlaylist.songs.concat(eachPlaylist.songs)
    }, []);
    const totalDuration = allSongs.reduce( (sum, eachSong) => {
      return sum + eachSong.duration
    }, 0);
    return(
      <div style={ {...defaultStyle, width: '40%', display: 'inline-block'} } >
        <h2 style={ {defaultStyle} }>{Math.floor(totalDuration / 60)} Hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return(
      <div style={ {defaultStyle} }>
        <img alt="Filter" />
        <input type="text" name="" id=""/>
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
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {}
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
          <Filter />
          <Playlist />
          <Playlist />
          <Playlist />
          <Playlist />
        </div> : <h1 style={defaultStyle}>Loading!</h1>
        }
      </div>
    );
  }
}

export default App;
