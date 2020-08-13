var config = {};

config.mongodb = {};
config.gnews = {};
config.cron = {};

config.mongodb.user = "root";
config.mongodb.password = "K2kWnX1lf8Zup3Rn";

config.mongodb.baseUri = `mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@cluster0.8jkad.mongodb.net/`;
config.mongodb.topnewsDB = {
	"uri": config.mongodb.baseUri + "top-news",
	"name": "top-news",
};
config.mongodb.topicsDB = {
	"uri": config.mongodb.baseUri + "topics",
	"name": "topics",
};
config.mongodb.searchDB = {
	"uri": config.mongodb.baseUri + "search",
	"name": "search",
};

config.gnews.token = "8e1bb0f7a7bde90e3c1f0351d1849673";
config.gnews.limit = 25;

config.cron.params = {
	max: config.gnews.limit,
	token: config.gnews.token,
};

module.exports = config;