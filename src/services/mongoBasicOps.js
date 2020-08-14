var { isKeyWord } = require('../utilities/articleUtils.js');


async function getArticles(collection, callback) {
    var articlesArray = [];
    var articles = await collection.findOne({ articles: { $exists:true } });
    console.log("retrieved documents");
    if(articles) {
        articles.articles.forEach((e) => articlesArray.push(e));
    }
    return articlesArray;
}

async function addArticles(collection, entries, updateDate, callback) {
    //sort by publish date to ensure ordered insertion into mongodb
    if(!entries) console.log("WHAT");
    entries = entries.sort((a, b) => a.publishedAt < b.publishedAt ? 1 : -1);

    // Get the collection and bulk api artefacts
    var bulkUpdateOps = [];    

    //push or update articles
    bulkUpdateOps.push(
        { updateOne: 
            {
                "filter": { articles: { $exists: true } },
                "update": { $set: { articles: entries } },
                "upsert": true,
            }
        }
    );

    //if need to update date, do it
    //should point to true -> first time inserting, word in keyword.json
    if(updateDate) {
        bulkUpdateOps.push(
            { updateOne: 
                {
                    "filter": { date_added: { $exists: true } },
                    "update": { $set: { date_added: new Date(Date.now()).toISOString() } },
                    "upsert": true,
                }
            }
        );
    }

    // bulk write to mongodb
    await collection.bulkWrite(bulkUpdateOps).then(function(r) {
        // do something with result
        console.log(`Successfully wrote ${entries.length + 1} entries!`);
    });
}

async function getAllCollections(db, callback) {
    var collectionList = await db.listCollections().toArray();

    //map collections to their names
    collectionList = collectionList.map(e => e.name);
    return new Set(collectionList);
}


async function dropCollection(collection, callback) {
    await collection.drop();
}

async function getCollectionAddDate(collection, callback) {
    var addDate = await collection.findOne({ "date_added": { $exists : true }});
    if(addDate) return addDate['date_added'];
    else return null;
}


module.exports.getArticles = getArticles;
module.exports.addArticles = addArticles;
module.exports.getAllCollections = getAllCollections;
module.exports.dropCollection = dropCollection;
module.exports.getCollectionAddDate = getCollectionAddDate;















