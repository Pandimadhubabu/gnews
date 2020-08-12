var fetch = require('node-fetch');
var config = require('../config.js');

module.exports.fetchNewsByKeyword = async function fetchNewsByKeyword(keyword) {

	var url = new URL("https://gnews.io/api/v3/search"),
    params = {
    	q: keyword,
    	max: config.gnews.limit,
    	token: config.gnews.token,
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

	return await fetch(url)
    .then(result => result.json())
    .then(data => {
    	return data;
    });
};

module.exports.fetchTopNews = async function fetchTopNews() {

	var url = new URL("https://gnews.io/api/v3/top-news"),
    params = {
    	max: config.gnews.limit,
    	token: config.gnews.token,
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

	return await fetch(url)
    .then(result => result.json())
    .then(data => {
    	return data;
    });
};

