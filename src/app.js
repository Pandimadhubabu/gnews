var express = require('express');
var express = require('express');
var cron = require('node-cron');
var cors = require('cors');
var helmet = require('helmet');
const routes = require('./routes.js');
// var { cronTest } = require('../tests/locktest.js');
var { cronJob, handleTopNews } = require('./scripts/cronjob.js');

//mongo setup
var app = express();
app.use(cors());
app.use(helmet());

// scheduler
// cron.schedule('*/2 * * * * *', () => {
// 	// cronJob();
// 	handleTopNews();
//   	console.log('running a task every minute');
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

