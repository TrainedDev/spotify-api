require('dotenv').config();
const querystring = require('querystring');
const axios = require('axios');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const login = async (req, res) => {
    console.log("login called");
    try {

        let state = "generateRanddajsipfuhgwrosdjomString(16)";
        const scope = 'user-read-private user-read-email user-top-read user-read-currently-playing user-modify-playback-state user-read-playback-state';

        const queryParams = querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state
        });

        res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);

    } catch (error) {
        res.status(500).json({ message: "failed to login", error: error.message });
    }
};

const getToken = async (req, res) => {
    console.log("getToken called");
    console.log("query params", req.query);

    const code = req.query.code || null;
    const state = req.query.state || null;

    if (!code || !state) {
        return res.redirect('/?' +
            querystring.stringify({
                error: 'state_mismatch'
            })
        );
    }

    const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
                grant_type: 'authorization_code',
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${authHeader}`
                }
            }
        );

        const { access_token, refresh_token, expires_in } = response.data;
        res.json({ access_token, refresh_token, expires_in });
    } catch (error) {
        res.status(500).json({ message: "Failed to get token", error: error.message });
    }
};

const fetchTopTenTracks = async (req, res) => {
    try {
        const fetchData = await axios.get(
            // can use this trackIds in query string= 6rqhFgbbKwnb9MLmUQDhG6
            `https://api.spotify.com/v1/tracks?limit=10&ids=${req.query.trackIds}`,
            {
                headers: {
                    Authorization: `Bearer ${req.query.token}`
                }
            }
        );

        res.status(200).json({ msg: "Top tracks fetched successfully", data: fetchData.data });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch top tracks", error: error.message });
    }
};

const currentPlayingTrack = async (req, res) => {
    try {
        const fetchData = await axios.get(
            'https://api.spotify.com/v1/me/player/currently-playing',
            {
                headers: {
                    Authorization: `Bearer ${req.query.token}`
                }
            }
        );

        res.status(200).json({ msg: "Current playing track fetched successfully", data: fetchData.data });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch current playing track", error: error.message });
    }
};

const pauseTrack = async (req, res) => {
    try {
        await axios.put(
            'https://api.spotify.com/v1/me/player/pause',
            {},
            {
                headers: {
                    Authorization: `Bearer ${req.query.token}`
                }
            }
        );
        res.status(200).json({ msg: "Track paused successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to pause track", error: error.message });
    }
};

const playTrack = async (req, res) => {
    try {
        const fetchData = await axios.put(
            'https://api.spotify.com/v1/me/player/play',
            {
                "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
                "offset": {
                    "position": 5
                },
                "position_ms": 0
            },
            {
                headers: {
                    Authorization: `Bearer ${req.query.token}`
                }
            }
        );

        res.status(200).json({ msg: "Track played successfully", data: fetchData.data });
    } catch (error) {
        res.status(500).json({ message: "Failed to play track", error: error.message });
    }
};

module.exports = {
    login,
    getToken,
    playTrack,
    pauseTrack,
    currentPlayingTrack,
    fetchTopTenTracks
};