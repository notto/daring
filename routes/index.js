
function controllers(params){
	var mongoose = params.mongoose;
	var client = params.client;
	//Mongoose models
	var challengeSchema = mongoose.Schema({
		_challengerId: mongoose.Schema.Types.ObjectId,
		_victimId: mongoose.Schema.Types.ObjectId,
		challenge: String,
		proofSource: String,
		proofLikes: Number,
		proofDislikes: Number,
		success: Boolean,
		comments: [String]
	});
	var userSchema = mongoose.Schema({
		first_name: String,
		last_name: String,
		fb: Number,
		phone: String,
		email: String,
		challenges: [mongoose.Schema.Types.ObjectId],
		successes: Number,
		failures: Number
	});
	var Challenge = mongoose.model('Challenge', challengeSchema);
	var User = mongoose.model('User', userSchema);
	controllers.index = function(req, res){
		/*var Joe = new User({name:"Joe", phone:"6513071790"});
		var Nick = new User({name:"Nick", phone:"5712246320"});
		var JoeChallenge = new Challenge({_challengeID:Nick._id, _victimId:Joe._id, challenge:"Pee on teacher"});
		Joe.save();
		Nick.save();
		JoeChallenge.save();*/
		/*client.sendSms({

			to:'+15712246320', // Any number Twilio can deliver to
		    from: '+15717485472', // A number you bought from Twilio and can use for outbound communication
		    body: 'a;sldkfjas;ldkfj;asldkfjkjfdkjs'

		}, function(err, responseData) { //this function is executed when a response is received from Twilio

	    	if (err) { // "err" is an error received during the request, if any

	        	// "responseData" is a JavaScript object containing data received from Twilio.
	        	// A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	        	// http://www.twilio.com/docs/api/rest/sending-sms#example-1
	        	console.log(err);
	    	}
	    	else{
	    		console.log(responseData.from); // outputs "+14506667788"
	        	console.log(responseData.body); // outputs "word to your mother."
			}
		});*/
		res.render('index', { title: 'Daring' });
	};
	controllers.checkUser = function(req, res){
		var user_id = req.query.user_id;
		User.find({fb: user_id}, function(err, users){
			console.log(users);
			if(users.length > 0) seen = true;
			else seen = false;
		});
		
		res.send({seen: seen});
	}
	controllers.register = function(req, res){
		res.render('register', {title: 'Daring'});
	}
	controllers.createUser = function(req, res){
		var cell = req.body.cell;
		var email = req.body.email;
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var fb = req.body.fb;
		var thisUser = new User({first_name:first_name, last_name:last_name, email:email, cell:cell, fb:fb});
		thisUser.save();
		res.render('index', {title: 'Daring'});
	}
	return controllers;
}

module.exports = controllers;