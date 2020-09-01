const express = require('express');
const { topNews } = require('./controllers/topNews.js');
const { searchTopic } = require('./controllers/searchTopic.js');
const { searchNews } = require('./controllers/searchNews.js');
const router = express.Router();

router.get('/top-news', topNews);
router.get('/topics/:topic', searchTopic);
router.get('/search', searchNews);

module.exports = router;
