import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // bm: Shortcut sender token som query param eller POST body
    const token = req.query.token || (req.body && req.body.token);
    if (!token) return res.status(400).json({ error: "No token provided" });

    // kall Spotify API
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 204) {
      return res.status(200).json({ playing: false });
    }

    const data = await response.json();
    if (!data || !data.item) {
      return res.status(200).json({ playing: false });
    }

    res.status(200).json({
      track: data.item.name,
      artist: data.item.artists.map(a => a.name).join(", "),
      album: data.item.album.name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
