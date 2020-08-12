var moment = require('moment');

module.exports.reduceArticles = function(articles, count) {
	const boundaries = getTimeHourAgo();
	var start = boundaries[0];
	var end = boundaries[1];

	var articleArray = [];
	var i = 0;

	console.log(end);

	//while still more articles to iterate through and articleArray less than length
	while(i < articles.length && articleArray.length < count) {

		if(articles[i].publishedAt < end) articleArray.push(articles[i]);
		i++;
	}

	// console.log("ARTICLES: ", articles);
	return articleArray;
};

module.exports.getTimeHourAgo = function() {
 //    var localDate = new Date();
	// var localMoment = moment();

	var start = moment();
	start.subtract(1, 'hours');
	start.subtract(start.minutes(), 'minutes');
	start.subtract(start.seconds(), 'seconds');

	var end = moment();
	end.subtract(end.minutes(), 'minutes');
	end.subtract(end.seconds(), 'seconds');
	// var localMoment = moment();
	// var utcMoment = moment.utc();


	return [start.format('YYYY-MM-DD HH:mm:ss') + " UTC", end.format('YYYY-MM-DD HH:mm:ss') + " UTC"];
};