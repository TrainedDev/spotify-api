const { Router } = require('express');
const { login, getToken, fetchTopTenTracks, currentPlayingTrack, pauseTrack, playTrack } = require('../controller/controller');

const router = Router();

router.get('/login', login);
router.get("/callback/spotify", getToken);
router.get('/top-tracks', fetchTopTenTracks);
router.get('/currently-playing', currentPlayingTrack);
router.get('/pause', pauseTrack);
router.get('/play', playTrack);

module.exports = router;