
/**
 * Module dependencies.
 */

var express = require('express');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var client = require('twilio')('ACc0f7a6bb25312b649831d35bb25ace5e', 'cce8908cb5c4c64b39e6ad1b2c96ab6e');
var mongoose = require('mongoose');
mongoose.connect('mongodb://nwkotto:tr0uTmach1@ds043378.mongolab.com:43378/daring_dev');
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
app.get('/checkUser', controllers.checkUser);
app.get('/register', controllers.register);
app.post('/register', controllers.createUser);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
