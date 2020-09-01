var express = require('express');
var cron = require('node-cron');
var schedule = require('node-schedule');
var cors = require('cors');
var helmet = require('helmet');

const routes = require('./routes.js');
var { updateKeywords } = require('./scripts/updateKeywords.js');
var { updateNonKeywords } = require('./scripts/updateNonKeywords.js');

//mongo setup
var app = express();
app.use(cors());
app.use(helmet());

//invoke update on initialization
// updateKeywords();

// Schedule keyword update every hour
// schedule.scheduleJob('0 * * * *', function(){
// 	console.log("STARTING KEYWORD UPDATE AT:", new Date().toTimeString());
// 	updateKeywords();
// });

// // Schedule non-keyword update every 3 hours at the 30th minute mark
// // At 30 min so it doesn't interfere with keyword update
// schedule.scheduleJob('30 */3 * * *', function() {
// 	console.log("STARTING NON-KEYWORD UPDATE AT:", new Date().toTimeString());
// 	updateNonKeywords();
// });

app.get('/', (req, res) => res.send('App is working'));
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
	console.log(`Listening on ${PORT}`);
});

module.exports = {
  app
};
