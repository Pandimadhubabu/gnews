var { MongoClient } = require("mongodb");
var mongoConfig = require('../config.js').mongodb;
var cronConfig = require('../config.js').cron;

var { fetchNews } = require('../services/fetchNews.js');
var { getAllNews, dropCollection, addNews } = require('../services/mongoBasicOps.js');
var json = require('../data/keywords.json');


async function cronJob() {
	/****************************TOP NEWS****************************/
	await handleTopNews();

	/****************************TOPICS****************************/
	await handleTopics();

	/****************************SEARCH****************************/
	await handleSearch();
}

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

		//drop collection
		await dropCollection(collection);
		console.log("dropped top-news DB collection: ", collName);

		//fetch from gnews and update mongodb with new articles
		var params = cronConfig.params;
		var data = await fetchNews("top-news", params);
	    await addNews(collection, data.articles);
		console.log(`added documents to collection ${collName} in mongo!`);

	} finally {
		client.close();
	}

	console.log("*****************DONE WITH TOP NEWS*****************\n");
}


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

			//drop collection
			await dropCollection(collection);
			console.log("dropped topics DB collection: ", topic);

			//fetch from gnews and update mongodb with new articles
			var params = cronConfig.params;
			var data = await fetchNews("topic", params, topic);
		    await addNews(collection, data.articles);
	    	console.log(`added documents to collection ${topic} in mongo!`);
	    	console.log("***********");
	    	console.log('\n');
		}
	} finally {
		client.close();
	}
	console.log("*****************DONE WITH TOPICS*****************\n");
}

	
//get names of all collections in form of set, when iterating through collection, delete from set
async function handleSearch() {
	console.log("*****************STARTING SEARCH*****************\n");


	//mongo client setup
	const uri = mongoConfig.searchDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

	try {

		await client.connect();
		const db = client.db(mongoConfig.searchDB.name);

		var dbCollectionSet = await getAllNews(db);

		// //iterate through list of topics
		// var search = json['search'];
		// for(var key in search) {
		// 	console.log("***********");

		// 	//get topics term
		// 	searchTerm = search[key].term;

		// 	//set collection
		// 	let collection = db.collection(searchTerm);

		// 	//drop collection
		// 	await dropCollection(collection);
		// 	console.log("dropped topics DB collection: ", searchTerm);

		// 	//fetch from gnews and update mongodb with new articles
		// 	var params = cronConfig.params;
		// 	params.q = searchTerm.toLowerCase();

		// 	var data = await fetchNews("search", params);
		//     await addNews(collection, data.articles);

		//     //if our Search database has a required search term, remove it
		//     //we'll process leftovers later, where leftovers are non-required search terms
		//     dbCollectionSet.delete(searchTerm);

	 //    	console.log(`added documents to collection ${searchTerm} in mongo!`);
	 //    	console.log("***********");
	 //    	console.log('\n');
		// }


		//process search terms here
		// console.log(dbCollectionSet);

		dbCollectionSet.forEach(term => {
			console.log(term);




		});

	} finally {
		client.close();
	}

	console.log("*****************DONE WITH SEARCH*****************\n");
}


//prune stale collections after maybe 7 days??
async function handleStaleSearch(db, set) {
	//iterate over set
	//get collection information,
	//	-if date-added exceeds 7 days, mark as stale and remove otherwise leave it alone
}


handleSearch();























