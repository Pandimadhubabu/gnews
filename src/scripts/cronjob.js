var { MongoClient } = require("mongodb");
var mongoConfig = require('../config.js').mongodb;

var { fetchNews } = require('../services/fetchNews.js');
var { addArticles, getAllCollections, dropCollection, getCollectionAddDate } = require('../services/mongoBasicOps.js');
var { staleISOString } = require('../utilities/timeUtils.js');

var json = require('../data/keywords.json');

async function cronJob() {
	/****************************TOP NEWS****************************/
	await handleTopNews();

	/****************************TOPICS****************************/
	await handleTopics();

	/****************************SEARCH****************************/
	await handleSearch();
}

module.exports.cronJob = cronJob;


async function handleTopNews() {
	console.log("*****************STARTING TOP NEWS*****************\n");

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

	console.log("*****************STARTING TOPICS*****************");
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

	
//get names of all collections in form of set, when iterating through collection, delete from set
async function handleSearch() {
	console.log("*****************STARTING SEARCH*****************\n");

	//mongo client setup
	const uri = mongoConfig.searchDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	try {
		await client.connect();
		const db = client.db(mongoConfig.searchDB.name);

		//dbCollectionSet will hold all keywords that exist inside mongo database
		var dbCollectionSet = await getAllCollections(db);

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

		    //if our Search database has a required keywords, remove it
		    //we'll process leftovers later, where leftovers are non-required keywords
		    dbCollectionSet.delete(keyword);

	    	console.log("***********");
	    	console.log('\n');
		}

		// process non important keywords here
		// dbCollectionSet now contains all non-keywords that exist inside mongo database

		await handleStaleSearch(db, dbCollectionSet);

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
		console.log(`added articles about ${input.type}/${term} to collection in mongo!`);

	} else {
		console.log("DIDN'T WORK FOR", term);
		console.log(data.errors);
	}

	await new Promise(resolve => setTimeout(resolve, 500));
}

//prune stale collections after maybe 7 days??
async function handleStaleSearch(db, set) {
	//iterate over set
	//get collection information,
	//	-if date-added exceeds 7 days, mark as stale and remove otherwise leave it alone

	for(term of set) {
		var collection = db.collection(term);
		var addDateISO = await getCollectionAddDate(collection);

		//check whether collection is stale
		if(staleISOString(addDateISO, mongoConfig.staleDays)) {

			//drop the collection if stale
			console.log(`Dropping collection ${term}...`);
			await dropCollection(collection);
		} else {

			//update with fetch, don't update date_added
			var input = { type: "search", keyword: term };
			const data = await fetchNews(input);
			console.log(`${term} is not stale enough yet...`);
			if(!data.errors) await addArticles(collection, data.articles, false);
			else {
				console.log("DIDN'T WORK FOR", term);
				console.log(data.errors);
			}
		}

		console.log();

		await new Promise(resolve => setTimeout(resolve, 500));
	}
}
















