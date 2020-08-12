const express = require('express');
const { newsByKeyword } = require('./controllers/newsByKeyword.js');
const { topNews } = require('./controllers/topNews.js');
const router = express.Router();

router.get('/getnews/:keyword', newsByKeyword);
router.get('/topNews', topNews);

module.exports = router;
