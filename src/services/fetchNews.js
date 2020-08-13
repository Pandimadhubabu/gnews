var fetch = require('node-fetch');
var gnewsConfig = require('../config.js').gnews;

module.exports.fetchNews = async function fetchNews(input) {
	var url = "";

	var params;
	const type = input.type;
 	switch(type) {
	 	case "top-news":
	 		url = new URL("https://gnews.io/api/v3/top-news");
	 		params = gnewsConfig.default_params;
	 		break;
	 	case "topic":
	 		url = new URL(`https://gnews.io/api/v3/topics/${input.topic}`);
	 		params = gnewsConfig.default_params;
	 		break;
		case "search":
			url = new URL("https://gnews.io/api/v3/search");
			params = gnewsConfig.search_params;
			params.q = input.keyword;
			break;
 	}

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
	return await fetch(url)
    .then(result => result.json())
    .then(data => {
    	return data;
    });
};