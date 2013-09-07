function sortByName(a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId      : '201887256647649',                        // App ID from the app dashboard
    channelUrl : '//localhost:3000/channel.html', // Channel file for x-domain comms
    status     : true,                                 // Check Facebook Login status
    xfbml      : true                                  // Look for social plugins on the page
  });
  // Additional initialization code sfuch as adding Event Listeners goes here
  FB.getLoginStatus(function(response) {
    if (response.status !== 'connected' || response.status === 'not_authorized') {
      window.location = "/";
    } else {
      FB.api('/me/friends', function(response){
        friend_data = response.data.sort(sortByName);
        for(var i = 0; i < friend_data.length; i++){
          $("#victim").append("<option value = '"+friend_data[i].id+"'>"+response.data[i].name+"</option>");
        }
      });
      FB.api('/me', function(response){
        $(document).ready(function(){
          $("#challenger").val(response.id);
        });
      })
    }
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));