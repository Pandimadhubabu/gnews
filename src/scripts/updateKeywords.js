var { MongoClient } = require("mongodb");
var mongoConfig = require('../config.js').mongodb;

var { fetchNews } = require('../services/fetchNews.js');
var { addArticles } = require('../services/mongoOperations.js');

var json = require('../data/keywords.json');

async function updateKeywords() {
	/****************************TOP NEWS****************************/
	await handleTopNews();

	/****************************TOPICS****************************/
	await handleTopics();

	/****************************SEARCH****************************/
	await handleSearch();
}

module.exports.updateKeywords = updateKeywords;


async function handleTopNews() {
	console.log("*****************UPDATING TOP NEWS*****************\n");

	//mongo client setup
	const uri = mongoConfig.topnewsDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	try {

		//connect to mongo client and set db
		await client.connect();
		var db = client.db(mongoConfig.topnewsDB.name);

		//get single collection name of topnews (top news should only have one key)
		var collName = json["top-news"][0].term;

		//set collection
		let collection = db.collection(collName);

		//pass to handler function for fetching and adding news
		var input = { type: "top-news" };
		await handleOperation(collName, collection, input);

	} finally {
		client.close();
	}

	console.log("*****************DONE WITH TOP NEWS*****************\n");
}

module.exports.handleTopNews = handleTopNews;


async function handleTopics() {

	console.log("*****************UPDATING TOPICS*****************");
	//mongo client setup
	const uri = mongoConfig.topicsDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	try {

		//connect to mongo client and set db
		await client.connect();
		const db = client.db(mongoConfig.topicsDB.name);

		//iterate through list of topics
		var topics = json['topics'];
		for(var key in topics) {
			console.log("***********");
			//get topics term
			topic = topics[key].term;

			//set collection
			let collection = db.collection(topic);

			//pass to handler function for fetching and adding news
			var input = { type: "topic", topic: topic };
			await handleOperation(topic, collection, input);

	    	console.log("***********");
	    	console.log('\n');
		}
	} finally {
		client.close();
	}
	console.log("*****************DONE WITH TOPICS*****************\n");
}

module.exports.handleTopics = handleTopics;


//upate all keywords from JSON search field
async function handleSearch() {
	console.log("*****************UPDATING SEARCH*****************\n");

	//mongo client setup
	const uri = mongoConfig.searchDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	try {
		await client.connect();
		const db = client.db(mongoConfig.searchDB.name);

		// //iterate through list of topics
		var search = json['search'];
		for(var key in search) {
			console.log("***********");

			//get keyword
			keyword = search[key].term.trim().toLowerCase();
			//set collection
			let collection = db.collection(keyword);

			//pass to handler function for fetching and adding news
			var input = { type: "search", keyword: keyword };
			await handleOperation(keyword, collection, input);

	    	console.log("***********");
	    	console.log('\n');
		}
	} finally {
		client.close();
	}

	console.log("*****************DONE WITH SEARCH*****************\n");
}

module.exports.handleSearch = handleSearch;


async function handleOperation(term, collection, input) {

	//fetch from gnews and update mongodb with new articles
	var data = await fetchNews(input);
	//if no errors on fetch call -> eg if request limit not reached
	if(!data.errors) {
		//add fetch data to mongodb
		await addArticles(collection, data.articles, true);
		console.log(`added articles about ${term} to ${input.type} db in mongo!`);

	} else {
		console.log("DIDN'T WORK FOR", term);
		console.log(data.errors);
	}

	//set timeout so Gnews doesn't block requests
	await new Promise(resolve => setTimeout(resolve, 500));
}
