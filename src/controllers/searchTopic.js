var { MongoClient } = require("mongodb");
var { checkNewsExists, getNews, addNews } = require('../services/mongoBasicOps.js');
var { fetchNews } = require('../services/fetchNews.js');
var mongoConfig = require('../config.js').mongodb;


async function searchTopic(req, res) {
	const uri = mongoConfig.topicsDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	//must lowercase here since using term to access coll in mongo
	var topic = req.params.topic.toLowerCase();
	var params = req.query;

	// const keyword = req.params.keyword.toLowerCase();
	try {
		await client.connect();
		const db = client.db(mongoConfig.topicsDB.name);
		const collection = db.collection(topic);

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

			var data = await fetchNews("topic", params, topic);
		    var writeResult = await addNews(collection, data.articles);
	    	console.log("added to mongo!");
		    res.json(data);
		}

	} finally {
		client.close();
	}
}

module.exports = { searchTopic };