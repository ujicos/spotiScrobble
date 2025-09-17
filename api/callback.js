import axios from 'axios';
import fs from 'fs';

export default async function handler(req, res) {
  const code = req.query.code;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      data: new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      }).toString()
    });

    const data = response.data;
    // data.access_token, data.refresh_token
    // Lagre token lokalt (eller i DB)
    fs.writeFileSync('tokens.json', JSON.stringify(data, null, 2));

    res.send('Spotify auth OK! Du kan lukke dette vinduet.');
  } catch (err) {
    res.status(500).send('Feil under Spotify OAuth: ' + err.message);
  }
}
