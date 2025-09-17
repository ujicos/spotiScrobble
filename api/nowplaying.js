import axios from 'axios';
import fs from 'fs';

export default async function handler(req, res) {
  try {
    const tokens = JSON.parse(fs.readFileSync('tokens.json'));
    const access_token = tokens.access_token;

    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (response.status === 204 || !response.data) {
      return res.json({playing: false});
    }

    const track = response.data.item;
    const logLine = `${Math.floor(Date.now()/1000)}\t${track.artists.map(a=>a.name).join(', ')}\t${track.name}\t${track.album.name}\n`;
    
    // Lagre til scrobble.log
    fs.appendFileSync('scrobble.log', logLine);

    res.json({playing: true, track: track.name, artist: track.artists.map(a=>a.name).join(', '), album: track.album.name});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
}
