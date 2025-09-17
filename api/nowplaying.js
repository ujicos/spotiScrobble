// /api/nowplaying.js
export default async function handler(req, res) {
  try {
    // 🔹 Midlertidig testdata
    // Du kan erstatte med ekte Spotify API-kall fra Shortcut senere
    const track = "Billie Jean";
    const artist = "Michael Jackson";
    const album = "Thriller";

    // 🔹 Returner JSON til Shortcut
    res.status(200).json({
      track: track,
      artist: artist,
      album: album
    });
  } catch (err) {
    console.error("Error in nowplaying:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
