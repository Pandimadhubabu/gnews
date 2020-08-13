const express = require('express');
const { topNews } = require('./controllers/topNews.js');
const { searchTopic } = require('./controllers/searchTopic.js');
const { searchNews } = require('./controllers/searchNews.js');
const router = express.Router();

router.get('/topNews', topNews);
router.get('/topics/:topic', searchTopic);
router.get('/search', searchNews);


// router.get('/querytest', (req, res) => {
// 	console.log(req.query);
// 	res.send({ message: 'query test'});
// });

module.exports = router;
