import axios from 'axios';



// Import required libraries
const axios = require('axios');

// Set up Spotify API credentials
const clientId = 'f82b3bb5008e449b83832ba241b30ef7';
const clientSecret = '0c87e84a36aa41079f0df8886bd9795b';
const accessToken = '';

// Function to get an access token for the Spotify API
async function getAccessToken() {
  const auth = Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64');
  const response = await axios.post('https://accounts.spotify.com/api/token', {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  });
  accessToken = response.data.access_token;
}

// Function to search for a song on Spotify
async function searchSong(songName) {
  await getAccessToken();
  const response = await axios.get(`https://api.spotify.com/v1/search/tracks`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    params: {
      q: songName,
      type: 'track'
    }
  });
  const tracks = response.data.tracks.items;
  if (tracks.length > 0) {
    return tracks[0];
  } else {
    return null;
  }
}

// Function to get song metadata from Spotify
async function getSongMetadata(trackId) {
  await getAccessToken();
  const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const track = response.data;
  return {
    songName: track.name,
    artistName: track.artists[0].name,
    artworkUrl: track.album.images[0].url,
    albumName: track.album.name,
    isSingle: track.album.album_type === 'single'
  };
}

// Example usage
const songName = 'Hello';
searchSong(songName).then(track => {
  if (track) {
    getSongMetadata(track.id).then(metadata => {
      console.log(`Song Name: ${metadata.songName}`);
      console.log(`Artist Name: ${metadata.artistName}`);
      console.log(`Artwork URL: ${metadata.artworkUrl}`);
      console.log(`Album Name: ${metadata.albumName}`);
      console.log(`Is Single: ${metadata.isSingle}`);
    });
  } else {
    console.log(`Song not found: ${songName}`);
  }
});