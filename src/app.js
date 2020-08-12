var express = require('express');
var express = require('express');
var cron = require('node-cron');
const routes = require('./routes.js');
var { updateNews } = require('./services/updateNews/updateNews.js');
//mongo setup
var app = express();

//scheduler
// cron.schedule('* */1 * * * *', () => {
// 	updateNews();
//   	console.log('running a task every hour');
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

