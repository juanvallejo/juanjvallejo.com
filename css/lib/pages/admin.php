<?php
session_start();
include("../config.php");
include("../resources/functions/user.php");

if(isset($_SESSION['user'])) {
	echo "<input type='text' placeholder='Enter a command...' id='terminal'/>";
} elseif(isset($_POST['username'])) {
	$user = new User();
	if($user->login($_POST['username'],$_POST['password'])) {
		echo "success";
	} else {
		echo $user->error;
	}		
} else {
echo '<div class="clear"></div><!--.clear-->
		<div class="login-container">
		<form class="loginform" action="#" name="login" id="loginform">
			<input type="text" name="username" id="username" placeholder="Username"/>
			<input type="password" name="password" id="password" placeholder="Password"/>
		</form>
		<div class="response"></div><!--.response-->
	</div><!--.login-container-->';
}
?>