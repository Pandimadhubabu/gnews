var express = require('express');
var express = require('express');
const routes = require('./routes.js');

// var yup = require('yup');

//mongo setup
var app = express();

//scheduler
var cron = require('node-cron');



app.get('/', (req, res) => res.send('App is working'));
app.use('/api', routes);
// cron.schedule('*/1 * * * * *', () => {
//   console.log('running a task every second');
// });


const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
	console.log(`Listening on ${PORT}`);
});



module.exports = {
  app
};

