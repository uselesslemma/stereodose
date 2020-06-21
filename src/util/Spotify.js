const clientId = '791f8273a2ef49f7af891a5d9cc53a43';
const redirectUri = 'http://stereodose.surge.sh/';
const baseUrl = 'https://api.spotify.com/v1/';
let accessToken;

const Spotify = {
  getAccessToken() {

    // return the access token if it already exists
    if (accessToken) {
      return accessToken;
    }

    // fetch the regex URL parameters: access token, expiration time
    const newAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (newAccessToken && newExpiresIn) {
      accessToken = newAccessToken[1];
      const expiresIn = Number(newExpiresIn[1]);

      // clear the parameters from the URL, so the app doesn’t try grabbing
      // the access token after it has expired
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    } else {
      const redirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = redirectUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`${baseUrl}search?type=track&q=${term}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      ).then(response => response.json()
      ).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => (
          {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            image: track.album.images[2].url,
            uri: track.uri
          }
        ));
      });
  },

  savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch(`${baseUrl}me`, { headers: headers }
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`${baseUrl}users/${userId}/playlists`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: name })
        }
      ).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`${baseUrl}users/${userId}/playlists/${playlistId}/tracks`,
          {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackURIs })
          }
        );
      });
    });
  }
};

export default Spotify;
