require('heroku-self-ping').default("https://upwork-gnews-app.herokuapp.com");
var express = require('express');
var cron = require('node-cron');
var schedule = require('node-schedule');
var cors = require('cors');
var helmet = require('helmet');

const routes = require('./routes.js');
var { cronJob, handleTopNews } = require('./scripts/cronjob.js');

//mongo setup
var app = express();
app.use(cors());
app.use(helmet());

//invoke update on initialization
cronJob();

// Schedule update every hour
schedule.scheduleJob('0 * * * *', function(){
	console.log(new Date().toISOString());
	cronJob();
});

//stress testing updates on mongodb
// cron.schedule('*/1 * * * * *', () => {
// 	handleTopNews();
//   	console.log('running a task every second');
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

