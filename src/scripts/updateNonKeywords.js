var { MongoClient } = require("mongodb");
var mongoConfig = require('../config.js').mongodb;

var { fetchNews } = require('../services/fetchNews.js');
var { addArticles, getAllCollections, dropCollection, getCollectionAddDate } = require('../services/mongoOperations.js');
var { staleISOString } = require('../utilities/timeUtils.js');

var json = require('../data/keywords.json');

async function updateNonKeywords() {
    console.log("*****************UPDATING NON KEYWORDS *****************");
    //mongo client setup
	const uri = mongoConfig.searchDB.uri;
	const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
		await client.connect();
		const db = client.db(mongoConfig.searchDB.name);

		//dbCollectionSet will hold all keywords that exist inside mongo database
		var dbCollectionSet = await getAllCollections(db);

		//iterate through list of topics
		var search = json['search'];
		for(var key in search) {
		    //delete keyword terms from dbCollectionSet to process
            keyword = search[key].term.trim().toLowerCase();
		    dbCollectionSet.delete(keyword);
		}

        //update or prune terms
		await handleStaleSearch(db, dbCollectionSet);
	} finally {
		client.close();
	}

    console.log("*****************DONE WITH NON KEYWORDS*****************\n");
}

async function handleStaleSearch(db, set) {
	//iterate over set
	for(term of set) {
		var collection = db.collection(term);
		var addDateISO = await getCollectionAddDate(collection);

		//check whether collection is stale
		if(staleISOString(addDateISO, mongoConfig.staleDays)) {

			//drop the collection if stale
			console.log(`${term} is stale, dropping collection...`);
			await dropCollection(collection);
		} else {

			console.log(`${term} is not stale enough yet...`);

			//update with fetch, don't update date_added
			var input = { type: "search", keyword: term };
			const data = await fetchNews(input);
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

module.exports.updateNonKeywords = updateNonKeywords;
