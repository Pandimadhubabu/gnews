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
config.mongodb.staleDays = 2;

config.gnews.token = "9a4d5214b11ae43849fc3980da69141b";
config.gnews.limit = 50;
config.gnews.default_max = 20;
config.gnews.params = {
	max: config.gnews.limit,
	token: config.gnews.token,
};

module.exports = config;