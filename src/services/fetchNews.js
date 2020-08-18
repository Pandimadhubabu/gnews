var fetch = require('node-fetch');
var gnewsConfig = require('../config.js').gnews;

module.exports.fetchNews = async function fetchNews(input) {
	var url = "";

	var params = gnewsConfig.params;
	const type = input.type;
 	switch(type) {
	 	case "top-news":
	 		url = new URL("https://gnews.io/api/v3/top-news");
	 		break;
	 	case "topic":
	 		url = new URL(`https://gnews.io/api/v3/topics/${input.topic}`);
	 		break;
		case "search":
			url = new URL("https://gnews.io/api/v3/search");
			params.q = input.keyword;
			break;
 	}

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
	return await fetch(url)
    .then(result => result.json())
    .then(data => {
    	return data;
    })
    .catch(err => console.log("FETCHING ERROR!!:", err));
};