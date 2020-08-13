var fetch = require('node-fetch');
var config = require('../config.js');

module.exports.fetchNews = async function fetchNews(type, params, topic) {
	var url = "";
 	switch(type) {
	 	case "top-news":
	 		url = new URL("https://gnews.io/api/v3/top-news");
	 		break;
	 	case "topic":
	 		url = new URL(`https://gnews.io/api/v3/topics/${topic}`);
	 		break;
		case "search":
			url = new URL("https://gnews.io/api/v3/search");
			break;
 	}
    params.token = config.gnews.token;
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

	return await fetch(url)
    .then(result => result.json())
    .then(data => {
    	return data;
    });
};