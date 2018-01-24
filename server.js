//server.js

//Base Setup
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/database');
var passport = require('./config/passport');

//Connect to Database
mongoose.Promise = global.Promise;
mongoose.connect(config.url, {useMongoClient: true});

mongoose.connection.on('open', function() {
	console.log('Connected to database ' + config.url);
});

mongoose.connection.on('error', function(err) {
	console.log('Database error ' + err);
});

//configure Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure passport
app.use(passport.initialize());
app.use(passport.session());

//set the port
var port = process.env.PORT || 8080;

//Routes
var transactionRouter = require('./routes/transactions');
var userRouter = require('./routes/users');
var groupRouter = require('./routes/groups');

//Routes for the 
app.get('/api', function(req, res) {
    res.json({ message: 'welcome to our api'});
});

//Register the routes
app.use('/api/transaction', transactionRouter);
app.use('/api/user', userRouter);
app.use('/api/group', groupRouter);

app.use(function(err, req, res, next){
	 res.status(500).json({'error': err});
});

//Start server
app.listen(port);
console.log('Listening on port ' + port);
