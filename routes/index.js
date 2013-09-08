
function controllers(params){
	var mongoose = params.mongoose;
	var client = params.client;
	//Mongoose models
	var challengeSchema = mongoose.Schema({
		_id: Number,
		_challengerId: Number,
		_victimId: Number,
		challenge: String,
		reward: String,
		rewardValue: Number,
		proofSource: String,
		proofLikes: Number,
		proofDislikes: Number,
		active: Boolean,	
		success: Boolean,
		comments: [String]
	});
	var userSchema = mongoose.Schema({
		_id: Number,
		first_name: String,
		last_name: String,
		fb: Number,
		phone: String,
		challenges: Number,
		successes: Number,
		failures: Number
	});
	var Challenge = mongoose.model('Challenge', challengeSchema);
	var User = mongoose.model('User', userSchema);
	controllers.index = function(req, res){
		Challenge.find({ active: 'true' }, function(err, challenges){
			res.render('index', { title: 'Daring', challenges: challenges });
		});
	};
	controllers.mychallenges = function(req, res){
		var userKey;
		var userId = req.params.userId;
		User.find({ fb: userId }, function(err, user){
			userKey = user.challenges;
		});
		Challenge.find({ active: 'true', _victimId: userKey }, function(err, challenges){
			if (err) console.log(err);
			res.render('mychallenges', { title: 'Daring', challenges: challenges } );
		});
	};
	controllers.challenge = function(req, res){
		var challengeId = req.params.challengeId;
		Challenge.find({ active: 'true', _id: challengeId  }, function(err, challenges){
			if (err) console.log(err);
			res.render('challenge', { title: 'Daring', challenges: challenges } );
		});
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
	controllers.newChallenge = function(req, res){
		res.render('newChallenge', {title: 'Daring'});
	}
	controllers.createChallenge = function(req, res){
		var victimId = req.body.victim;
		var challengerId = req.body.challenger;
		console.log(challengerId);
		var challenge = req.body.challenge;
		var reward = req.body.reward;
		var rewardValue = req.body.rewardValue;
		var victimNumber = "";
		var sendTo = req.body.sendTo;
		User.find({fb: victimId}, function(err, victims){
			if(err)res.redirect("/");
			else{
				if(victims.length > 0) victimNumber = victims[0].phone;
			}
			var challengerName = "Anonymous";
			User.find({fb: challengerId}, function(err, users){
				if(err)console.log("damn");
				else{
					if(users.length > 0) challengerName = users[0].first_name + " " + users[0].last_name;
				}
				var message = challengerName + " sent you a challenge: " + challenge;
				if(reward != null && reward != ""){
					if(reward == "Venmo"){
						message += " - Reward: $"+rewardValue;
					} else {
						message += " - Reward: "+reward;
					}
				}
				if(sendTo == "SMS" && victimNumber !== ""){
					//Send challenge by text
					client.sendSms({

						to:'+1'+victimNumber, // Any number Twilio can deliver to
					    from: '+15717485472', // A number you bought from Twilio and can use for outbound communication
					    body: message

					}, function(err, responseData) { //this function is executed when a response is received from Twilio

				    	if (err) { // "err" is an error received during the request, if any

				        	// "responseData" is a JavaScript object containing data received from Twilio.
				        	// A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
				        	// http://www.twilio.com/docs/api/rest/sending-sms#example-1
				        	console.log(err);
				    	}
				    	else{
				    		var newChallenge = new Challenge({_challengerId:users[0]._id, _victimId:victims[0]._id, challenge:challenge, reward:reward, rewardValue:rewardValue, active:true});
				    		newChallenge.save(function(err, theChallenge){
				    			if(err) console.log(err);
				    			else console.log(theChallenge);
				    		});
				    		console.log(responseData.from); // outputs "+14506667788"
				        	console.log(responseData.body); // outputs "word to your mother."
						}
						res.redirect('/');
					});
				} else {
					//Send challenge to FB
					res.render('feedPost', {title:"Daring", message:message, user_id:victimID});
				}
			});
		});
	}
	return controllers;
}

module.exports = controllers;
