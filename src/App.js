import React, { Component } from 'react';
import 'reset-css';
import './App.css';

const defaultStyle = {
  color: 'black',
  fontFamily: 'Helvetica'
};

const counterStyle = {
  ...defaultStyle,
  width: '40%',
  display: 'inline-block',
  marginBottom: '2rem',
  fontSize: '1rem',
  lineHeight: '1.5rem',
}

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
            duration: 3000
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
    const playlistCounterStyle = {
      ...counterStyle
    };

    return(
      <div style={ playlistCounterStyle } >
        <h2>{this.props.playlists.length} Playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    /* reduce params:
     * 1. function(accumulating value, current value)
     * 2. initial state (in this case, empty list) 
    */
    // creates an array of all songs from every playlist
    const allSongs = this.props.playlists.reduce((songs, currentPlaylist) => { 
      return songs.concat(currentPlaylist.songs);
    }, []);
    // adds up duration of every song
    const totalDuration = allSongs.reduce((sum, currentSong) => {
      return sum + currentSong.duration;
    }, 0);

    const durationIsLow = (totalDuration / 3600) < 1;

    const hoursCounterStyle = {
      ...counterStyle,
      color: durationIsLow ? 'red' : 'white',
      fontWeight: durationIsLow ? 'bold' : 'normal'
    }

    return(
      <div style={ hoursCounterStyle } >
        { Math.floor(totalDuration / 3600) < 1
          ? <h2>{Math.floor(totalDuration / 60)} Minutes</h2>
          : <h2>{Math.floor(totalDuration / 3600)} Hours</h2>
        }
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
        <input type="text" 
          onChange={ event => 
            this.props.onTextChange(event.target.value) 
          }
          style={{
            ...defaultStyle,
            padding: '0.5rem',
            fontSize: '1rem'
          }}
        />
        Filter
      </div>
    );
  }
}

class Playlist extends Component {
  isEven(number) {
    return number % 2
  }

  render() {
    const playlistStyle = {
      ...defaultStyle,
      width: '24%',
      display: 'inline-block',
      padding: '1rem',
      backgroundColor: this.isEven(this.props.index) ? 'inherit' : 'gray'
    }
    return(
      <div style={ playlistStyle }>
        <img src={ this.props.playlist.imageUrl } style={{ width: '80%' }} alt=""/>
        <h3>{ this.props.playlist.name }</h3>
        <ul style={{ 
          textAlign: 'left',
          marginTop: '10px'
        }}>
          { this.props.playlist.songs.slice(0,3).map( song =>
            <li style={{
              paddingTop: '10px'
            }}>
              { song.name }
            </li>
          ) }
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      playlists: [],
      filterString: ''
    }
  }


  // Fetches data once the component has loaded
  componentDidMount() {
    const accessToken = new URLSearchParams(window.location.search).get('access_token');
    // Cancels data fetch if user isn't logged in
    if (!accessToken) return;

    // Provide user name from user data via Spotify API
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    .then(data => {
      this.setState({
        user: {
          name: data.display_name || data.id
        }
      }
    )});

    // Get user playlists via Spotify API
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    // Gets playlists' full track data from track URL
    .then(playlistData => {
      let playlists = playlistData.items; // All of a user's playlists
      const trackDataPromises = playlists.map(playlist => { // Creates promises that fetch full track URLs for every playlist
        return fetch(playlist.tracks.href, { // Fetches the URL containing full details of the playlist's tracks
          headers: { 'Authorization': 'Bearer ' + accessToken }
        })
        .then(response => response.json());
      });
      /* Promise.all() takes an array of promises, executes them, and 
        returns their resolutions. */
      // Adds trackData to playlist data
      return Promise.all(trackDataPromises) // Executes all promises in trackDataPromises
        .then(trackData => { // Fills an array with all of the track URL data
          trackData.forEach((data, i) => {
            // Data filtering
            playlists[i].trackData = data.items
              .map(item => item.track) // extracts track data from track Objects in trackData
              .map(track => ({
                name: track.name,
                duration: track.duration_ms / 1000
              }));
          });
          return playlists;
        });
    })
    .then(playlists => {
      this.setState({
        playlists: playlists.map(playlist => {
          return {
            name: playlist.name, 
            songs: playlist.trackData,
            imageUrl: playlist.images[0].url
          };
        })
      });
    });
  }

  render() {
    // Creates an array of only the playlists that should be rendered based on filtering
    // Notes:
    // Array.filter() creates a new array of elements that will respond 'true' to the
    // return statement.
    // Array.map() calls the provided callback function on each element in the array.
    let playlistsToRender = 
      this.state.user && 
      this.state.playlists
        ? this.state.playlists.filter(playlist => {
            let matchesPlaylist = playlist.name.toLowerCase().includes(
              this.state.filterString.toLowerCase());
            let matchesVisibleSongs = playlist.songs.slice(0,3).find(
              song => song.name.toLowerCase().includes(
                this.state.filterString.toLowerCase())
            );
            return matchesPlaylist || matchesVisibleSongs;
          })
        : []
    ;
    return (
      <div className="App">
        { this.state.user ?    // checks if server data exists,
                               // renders the following JSX if true
        <div>
          <h1 style={ {...defaultStyle, fontSize: "4rem", marginBottom: "4rem"} }>
            {this.state.user.name}'s Playlist
          </h1>
          <PlaylistCounter playlists={ playlistsToRender } />
          <HoursCounter playlists={ playlistsToRender } />
          <Filter onTextChange={ text => this.setState({    // onTextChange() assigns received text to the filterString state
            filterString: text
          }) } />
          { 
            playlistsToRender.map((playlist, i) =>
              <Playlist playlist={playlist} index={i} />
            ) 
          }
        </div> : <button onClick={ () => {
                    window.location = window.location.href.includes('localhost') 
                    ? 'http://localhost:8888/login'
                    : 'https://rxnaij-playlists-backend.herokuapp.com/login'
                  }}
                  style={{...defaultStyle, padding: '50px', fontSize: '2rem', marginTop: '2rem'}}>
                    Sign in with Spotify
                 </button>
        }
      </div>
    );
  }
}

export default App;
