var { MongoClient } = require("mongodb");
var { checkNewsExists, getNews, addNews } = require('../services/mongoBasicOps.js');
var { fetchNews } = require('../services/fetchNews.js');
var mongoConfig = require('../config.js').mongodb;


async function topNews(req, res) {
	const uri = mongoConfig.topnewsDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	try {
		await client.connect();
		const db = client.db(mongoConfig.topnewsDB.name);
		const collection = db.collection("top-news");

		const newsExists = await checkNewsExists(collection);
		if(newsExists) {
			console.log("news exists!");
			var ret = {};
			const news = await getNews(collection);
			ret.articles = news;
			res.json(ret);
		} else {
			//deprecated after cron job
			console.log("news does not exist yet");
		    var data = await fetchNews("top-news", req.query);

		    var writeResult = await addNews(collection, data.articles);
	    	console.log("added to mongo!");
		    res.json(data);
		}

	} finally {
		client.close();
	}
}

module.exports = { topNews };