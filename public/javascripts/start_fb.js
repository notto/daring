window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId      : '201887256647649',                        // App ID from the app dashboard
    channelUrl : '//localhost:3000/channel.html', // Channel file for x-domain comms
    status     : true,                                 // Check Facebook Login status
    xfbml      : true                                  // Look for social plugins on the page
  });
  // Additional initialization code such as adding Event Listeners goes here
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      //authenticated
      var uid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      FB.api('/me', function(response) {
        console.log(response);
        $.ajax({
          type:"GET",
          url:"/checkUser",
          data:{user_id: response.id},
          success:function(data){
            console.log(data);
            if(data.seen == false){
              window.location = "/register";
            } else {
              $("#login").remove();
            }
          },
          failure:function(){
            window.location = "/register";
          }
        });
      });
    }
  });
};

// Load the SDK asynchronously
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/all.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

function login(){
  FB.login(function(){
    window.location = "/";
  });
}
