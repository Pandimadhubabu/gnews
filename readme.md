## API Call Types

Backend has 3 different GET APIs:
* top-news (/api/top-news)
* topics (/api/topics/:topic)
* search (/api/search&q="")

**Be sure to use the correct API call for each type (eg. use /api/top-news for top-news or /api/topics/science for science topic)**


## MongoDB Schema
Each API has their respective database in MongoDB, top-news DB has 1 collection being top-news, topics DB has 8 collections for each topic, and search has a variable amount of collections, at least the amount of terms under the search field in keywords.json.

Each collection in a database represents a term. The name of the collection is the term word and it contains an articles key denoting a list of articles fetched from the gnews API. It also contains a date_added key denoting the date it was added to the database.

## Logic
API calls work by first checking their respective database and if the term doesn't exist in the database, a fetch to gnews API will occur to create and populate a collection in that respective db (eg. api/topics/science will check db topics for a science collection and if it doesn't exist call the gnews API for science topic). If the term already exists, it will pull the results from the db.

Every hour, every term in the db will be updated using the gnews fetch API. Any term that exists within the db that is not defined in their respective field in keywords.json will be removed after 2 days. This can be changed under 'config.js' by setting 'config.mongodb.staleDays' to a new day amount.  

## Config File
Admin information can be reconfigured under the config.js file. If the MongoDB cluster has been moved, simply edit config.mongodb values to adjust to the new address. Comments are made on the file denoting what the variables pertain to.
