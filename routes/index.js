
function controllers(params){
	var mongoose = params.mongoose;
	var client = params.client;
	//Mongoose models
	var challengeSchema = mongoose.Schema({
		_challengerId: mongoose.Schema.Types.ObjectId,
		_victimId: mongoose.Schema.Types.ObjectId,
		challenge: String,
		reward: String,
		proofSource: String,
		proofLikes: Number,
		proofDislikes: Number,
		active: Boolean,	
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
		res.render('index', { title: 'Daring' });
	};
	controllers.checkUser = function(req, res){
		var user_id = req.query.user_id;
		User.find({fb: user_id}, function(err, users){
			if(users.length > 0) res.send({seen: true});
			else res.send({seen: false});
		});
	}
	controllers.register = function(req, res){
		res.render('register', {title: 'Daring'});
	}
	controllers.createUser = function(req, res){
		var phone = req.body.phone;
		var email = req.body.email;
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var fb = req.body.fb;
		var thisUser = new User({first_name:first_name, last_name:last_name, email:email, phone:phone, fb:fb});
		thisUser.save();
		res.render('index', {title: 'Daring'});
	}
	controllers.challenge = function(req, res){
		res.render('challenge', {title: 'Daring'});
	}
	controllers.createChallenge = function(req, res){
		var victimId = req.body.victim;
		console.log(victimId);
		var challengerId = req.body.challenger;
		var challenge = req.body.challenge;
		var reward = req.body.reward;
		var victimNumber = "";
		User.find({fb: victimId}, function(err, users){
			if(err)console.log("damn");
			else{
				if(users.length > 0) victimNumber = users[0].phone;
			}
			var challengerName = "Anonymous";
			User.find({fb: challengerId}, function(err, users){
				if(err)console.log("damn");
				else{
					if(users.length > 0) challengerName = users[0].first_name + " " + users[0].last_name;
				}
				if(victimNumber !== ""){
					console.log(victimNumber);
					client.sendSms({

						to:'+1'+victimNumber, // Any number Twilio can deliver to
					    from: '+15717485472', // A number you bought from Twilio and can use for outbound communication
					    body: challengerName + " sent you a challenge: " + challenge

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
					});
				}
			});
		});
		
		
		res.redirect("/");
	}
	return controllers;
}

module.exports = controllers;