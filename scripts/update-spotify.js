// const fs = require("fs");

// let readme = fs.readFileSync("./README.md", "utf8");

// readme = readme.replace(
//     /<!-- SPOTIFY:START -->([\s\S]*?)<!-- SPOTIFY:END -->/,
//     `<!-- SPOTIFY:START -->
// ✅ TEST BERHASIL
// <!-- SPOTIFY:END -->`
// );

// fs.writeFileSync("./README.md", readme);

// console.log("DONE");


const fs = require("fs");
const axios = require("axios");

const README = "./README.md";

async function getAccessToken() {
    const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    });

    const { data } = await axios.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return data.access_token;
}

async function getCurrentTrack(token) {
    try {
        const { data } = await axios.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                validateStatus: () => true,
            }
        );

        if (!data || !data.item) {
            return "🎧 Not playing anything right now.";
        }

        return `🎧 **${data.item.name}**\n👤 ${data.item.artists.map(a => a.name).join(", ")}\n💿 ${data.item.album.name}`;
    } catch (e) {
        console.error(e.response?.data || e.message);
        return "🎧 Unable to fetch Spotify.";
    }
}

(async () => {
    console.log("Getting token...");
    const token = await getAccessToken();

    console.log("Getting current track...");
    const spotify = await getCurrentTrack(token);

    console.log(spotify);

    const readme = fs.readFileSync(README, "utf8");

    const updated = readme.replace(
        /<!-- SPOTIFY:START -->([\s\S]*?)<!-- SPOTIFY:END -->/,
        `<!-- SPOTIFY:START -->\n${spotify}\n<!-- SPOTIFY:END -->`
    );

    fs.writeFileSync(README, updated);

    console.log("README updated.");
})();