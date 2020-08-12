module.exports.checkNewsExists = async function checkNewsExists(collection, callback) {
	const numOfDocs = await collection.countDocuments({});
	return numOfDocs != 0;

};

module.exports.getNews = async function getNews(collection, callback) {
	var news = await collection.find().toArray();
	var newsArray = [];
	for(var i = 0; i < news.length; i++) {
		if(!news[i]['_date-added']) {
			newsArray.push(news[i]);
		}
	}
    console.log("retrivied documents");
	return newsArray;
};

module.exports.addNews = async function addNews(collection, entries, callback) {

    // Get the collection and bulk api artefacts
    var bulkUpdateOps = [];    
    entries.forEach(function(doc) {
        bulkUpdateOps.push({ "insertOne": { "document": doc } });
    });

    //insert current date
    bulkUpdateOps.push({"insertOne": {"document": {
                    "_date-added": new Date(Date.now()).toISOString(),
	} } });

    if (bulkUpdateOps.length > 0) {
        await collection.bulkWrite(bulkUpdateOps).then(function(r) {
            // do something with result
            console.log(`Successfully wrote ${bulkUpdateOps.length} entries!`);
        });
    }

    return bulkUpdateOps;
};