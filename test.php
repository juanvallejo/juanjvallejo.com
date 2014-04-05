<!DOCTYPE html>
<html xmlns:fb="http://ogp.me/ns/fb#" lang="en">
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes" />
      <title>Test login</title>
       <script src="//connect.facebook.net/en_US/all.js"></script>
    </head>
    <body>

     <div id="fb-root"></div>
      <script>
        window.fbAsyncInit = function() {
          FB.init({
            appId      : '122597104561592', // App ID
            channelUrl : '//www.juanjvallejo.com/test.php', // Channel File
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true  // parse XFBML
          });
          FB.getLoginStatus(function(response) {
  			if (response.status === 'connected') {
 		    	testAPI();
  		    } else if (response.status === 'not_authorized') {
  		  		login();
 			} else {
 	 			login();
  			}
		 });
        };
        // Load the SDK Asynchronously
         (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=122597104561592";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

         function login() {
		 	FB.login(function(response) {
	  	  		if (response.authResponse) {
   	   	      		testAPI();
   	   	  		} else {
   	   	      		// cancelled
   	   	      		alert("An error has occurred.");
   		     	}
  		 	});
		 }
		 function testAPI() {
    		console.log('Welcome!  Fetching your information.... ');
    		FB.api('/me', function(response) {
        		console.log('Good to see you, ' + response.name + '.');
    		});
		 }
      </script>
	 <div class="fb-login-button" data-show-faces="true" data-width="200" data-max-rows="1"></div>
    </body>
 </html>