var { MongoClient } = require("mongodb");
var { checkNewsExists, getNews, addNews } = require('../services/mongoBasicOps.js');
var { fetchNews } = require('../services/fetchNews.js');
var mongoConfig = require('../config.js').mongodb;


async function searchNews(req, res) {
	const uri = mongoConfig.searchDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	//must lowercase here since using term to access coll in mongo
	var params = req.query;
	params.q = params.q.toLowerCase();
	try {
		await client.connect();
		const db = client.db(mongoConfig.searchDB.name);
		const collection = db.collection(params.q);

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
			var data = await fetchNews("search", params);

		    var writeResult = await addNews(collection, data.articles);
	    	console.log("added to mongo!");
		    res.json(data);
		}

	} finally {
		client.close();
	}
}

module.exports = { searchNews };