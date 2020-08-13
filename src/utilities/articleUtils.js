
function reduceArticles(articles, max) {
	articles = articles.slice(0, max);
	console.log(articles);


}

module.exports.reduceArticles = reduceArticles;

module.exports.isKeyWord = function isKeyWord(term) {
	var search = require('../data/keywords.json')['search'];
	let exists = false;
	if(search.some(e => e.term == term)) return true;
	return false;
};

