var config = {};

config.mongodb = {};
config.gnews = {};

config.mongodb.user = "root";
config.mongodb.password = "K2kWnX1lf8Zup3Rn";
config.mongodb.db = "test";
config.mongodb.uri = `mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@cluster0.8jkad.mongodb.net/test?retryWrites=true&w=majority`;

config.gnews.token = "9a4d5214b11ae43849fc3980da69141b";
config.gnews.limit = 50;
config.gnews.params = {
	max: config.gnews.limit,
	token: config.gnews.token,
};

module.exports = config;