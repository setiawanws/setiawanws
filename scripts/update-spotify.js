const fs = require("fs");
const axios = require("axios");

const README = "./README.md";

async function getAccessToken() {
    const params = new URLSearchParams();

    params.append("grant_type", "refresh_token");
    params.append("refresh_token", process.env.SPOTIFY_REFRESH_TOKEN);

    const res = await axios.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID +
                            ":" +
                            process.env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return res.data.access_token;
}

async function getCurrentTrack(token) {
    try {
        const res = await axios.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status !== 200 || !res.data.item) {
            return "🎧 Not playing anything right now.";
        }

        const track = res.data.item.name;
        const artist = res.data.item.artists
            .map((a) => a.name)
            .join(", ");

        const album = res.data.item.album.name;

        return `🎧 **${track}** - ${artist}\n💿 ${album}`;
    } catch (err) {
        return "🎧 Not playing anything right now.";
    }
}

(async () => {
    const token = await getAccessToken();

    const spotify = await getCurrentTrack(token);

    let readme = fs.readFileSync(README, "utf8");

    readme = readme.replace(
        /<!-- SPOTIFY:START -->([\s\S]*?)<!-- SPOTIFY:END -->/,
        `<!-- SPOTIFY:START -->\n${spotify}\n<!-- SPOTIFY:END -->`
    );

    fs.writeFileSync(README, readme);

    console.log("README updated.");
})();