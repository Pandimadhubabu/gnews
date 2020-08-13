var { MongoClient } = require("mongodb");
var { getArticles, addArticles } = require('../services/mongoBasicOps.js');
var { fetchNews } = require('../services/fetchNews.js');
var mongoConfig = require('../config.js').mongodb;
var gnewsConfig = require('../config.js').gnews;

async function topNews(req, res) {
	const uri = mongoConfig.topnewsDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	try {
		await client.connect();
		const db = client.db(mongoConfig.topnewsDB.name);
		const collection = db.collection("top-news");

		var articles = await getArticles(collection);
		if(articles.length == 0) {
			console.log("News does not exist yet");

			var input = { type: "top-news" };
		    var data = await fetchNews(input);
		    if(!data.errors) {
				var writeResult = await addArticles(collection, data.articles, true);
				console.log("added to mongo!");
				articles = data.articles;
			} else {
				console.log("Errored out");
				res.json({ message: "Errored out", errors: data.errors });
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

module.exports = { topNews };