var { MongoClient } = require("mongodb");
var { getArticles, addArticles } = require('../services/mongoOperations.js');
var { fetchNews } = require('../services/fetchNews.js');
var mongoConfig = require('../config.js').mongodb;
var gnewsConfig = require('../config.js').gnews;

async function searchNews(req, res) {
	const uri = mongoConfig.searchDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	//must lowercase here since using term to access coll in mongo
	const keyword = req.query.q.trim().toLowerCase();

	try {
		await client.connect();
		const db = client.db(mongoConfig.searchDB.name);
		const collection = db.collection(keyword);

		var articles = await getArticles(collection);
		if(articles.length == 0) {
			console.log("News does not exist yet");

			var input = { type: "search", keyword: keyword };
		    var data = await fetchNews(input);

		    if(!data.errors) {
				var writeResult = await addArticles(collection, data.articles, true);
				console.log("added to mongo!");
				articles = data.articles;
			} else {
				console.log("Errored out");
				return res.json({ message: "Errored out", error: data.errors });
			}
		}

		var ret = {};
		if(req.query.image && req.query.image.toLowerCase() == 'required') {
			articles = articles.filter(e => e.image != null);
		}
		var max = (req.query.max) ? req.query.max : gnewsConfig.default_max;
		ret.articles = articles.slice(0, max);
		res.json(ret);

	} finally {
		client.close();
	}
}

module.exports = { searchNews };
