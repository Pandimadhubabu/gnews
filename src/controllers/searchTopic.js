var { MongoClient } = require("mongodb");
var { getArticles, addArticles } = require('../services/mongoBasicOps.js');
var { fetchNews } = require('../services/fetchNews.js');
var mongoConfig = require('../config.js').mongodb;
var gnewsConfig = require('../config.js').gnews;

async function searchTopic(req, res) {
	const uri = mongoConfig.topicsDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	
	//must lowercase here since using term to access coll in mongo
	var topic = req.params.topic.toLowerCase();

	try {
		await client.connect();
		const db = client.db(mongoConfig.topicsDB.name);
		const collection = db.collection(topic);

		var articles = await getArticles(collection);
		if(articles.length == 0) {
			console.log("News does not exist yet");

			var input = { type: "topic", topic: topic };
		    var data = await fetchNews(input);
		    if(!data.errors) {
				var writeResult = await addArticles(collection, data.articles, true);
				console.log("added to mongo!");
				articles = data.articles;
			} else {
				console.log("Request limit reached");
				res.json({ message: "Request limit reached", data: data });
			}
		}

		var ret = {};
		var max = (req.query.max) ? req.query.max : gnewsConfig.default_max;
		ret.articles = articles.slice(0, max);
		res.json(ret);

	} finally {
		client.close();
	}
}

module.exports = { searchTopic };