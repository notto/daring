/**
 * Module dependencies.
 */

var express = require('express');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var client = require('twilio')('', '');
var mongoose = require('mongoose');
mongoose.connect('mongodb://<user>:<password>@ds043378.mongolab.com:43378/daring_dev');
var controllers = require('./routes')({mongoose: mongoose, client: client});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', controllers.index);
app.post('/', controllers.increment);
app.get('/checkUser', controllers.checkUser);
app.get('/register', controllers.register);
app.post('/register', controllers.createUser);
app.get('/newChallenge', controllers.newChallenge);
app.post('/newChallenge', controllers.createChallenge);
app.get('/mychallenges/:userId', controllers.mychallenges);
app.get('/challenge/:challengeId', controllers.challenge);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
