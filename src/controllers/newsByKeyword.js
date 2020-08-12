var { MongoClient } = require("mongodb");
var { checkNewsExists, getNews, addNews } = require('../services/getNews.js');
var { fetchNewsByKeyword } = require('../services/fetchNews.js');
var config = require('../config.js');


async function newsByKeyword(req, res) {
	const uri = config.mongodb.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	const keyword = req.params.keyword;
	try {
		await client.connect();
		const db = client.db(config.mongodb.db);
		const collection = db.collection(keyword);

		const newsExists = await checkNewsExists(collection);
		if(newsExists) {
			var ret = {};
			const news = await getNews(collection);
			ret.articles = news;
			res.json(ret);
		} else {
			//deprecated after cron job
			console.log("news does not exist yet");
			var data = await fetchNewsByKeyword(keyword);
		    var writeResult = await addNews(collection, data.articles);
	    	console.log("added to mongo!");
		    res.json(data);
		}

	} finally {
		client.close();
	}
}

module.exports = { newsByKeyword };