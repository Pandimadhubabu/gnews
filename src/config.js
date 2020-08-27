var config = {};

config.mongodb = {};
config.gnews = {};

//mongodb authentication
config.mongodb.user = "root";
config.mongodb.password = "K2kWnX1lf8Zup3Rn";

//Base URI for mongodb
config.mongodb.baseUri = `mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@cluster0.8jkad.mongodb.net/`;

//Configuration parameters for mongo databases
//name parameter indicates name of database on mongo server
config.mongodb.topnewsDB = {};
config.mongodb.topnewsDB.name = "top-news";
config.mongodb.topnewsDB.uri = config.mongodb.baseUri + config.mongodb.topnewsDB.name;

config.mongodb.topicsDB = {};
config.mongodb.topicsDB.name = "topics";
config.mongodb.topicsDB.uri = config.mongodb.baseUri + config.mongodb.topicsDB.name;

config.mongodb.searchDB = {};
config.mongodb.searchDB.name = "search";
config.mongodb.searchDB.uri = config.mongodb.baseUri + config.mongodb.searchDB.name;


config.mongodb.staleDays = 1;	//Days non-keywords can be stored in mongo DB before being removed


config.gnews.token = "9a4d5214b11ae43849fc3980da69141b";	//Gnews.io token
config.gnews.limit = 50;		//Limit to how many articles stored in DB during each fetch
config.gnews.default_max = 20;	//API call default max articles if no max query is given

config.gnews.params = {
	max: config.gnews.limit,
	token: config.gnews.token,
};

module.exports = config;
