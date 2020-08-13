var moment = require('moment');

// Checks if ISO String has passed daysToExpire days
function staleISOString(iso, daysToExpire) {
	var today = new Date();
	iso = new Date(iso);

	const timeInDay = 1000 * 60 * 60 * 24;
	return ((today.getTime() - iso.getTime()) / (timeInDay * daysToExpire)) >= 1;
}

module.exports.staleISOString =  staleISOString;













