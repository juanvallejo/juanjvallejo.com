<?php
session_start();
include("config.php");

$time = intval(time()-300);
$sq = mysql_query("UPDATE guests SET status='2' WHERE time < '$time'");
$time2 = intval(time()-600);
$sq = mysql_query("DELETE FROM guests WHERE time < '$time2'");

$hello = ($_SESSION['user'] ? "<span class='link' id='logout'>".$_SESSION['user']."</span>" : "Hello!");
echo "<div id='cookieexists' class='hidden'>".$_COOKIE['session']."</div>";
echo '<div id="header"><p class="title" id="logo">'.$hello.'</p></div><!--#header-->
	<div id="content">
		<div id="messages">';
if($_SESSION['user'] && $_COOKIE['session']) {
	echo '<span id="messageBox"></span>';
	echo '<div id="text">
			<input type="text" id="messageInput" placeholder="Type /help for info..."/>
		</div><!--#text-->';
	echo '<div class="item no-border" id="onlinestatus"></div>';
} elseif(!$_SESSION['user'] && $_COOKIE['session']) {
	echo "<div id='checkReturningUser'>Loading, please wait...</div>";
} else {
?>
<div class="item" id="notices"></div>
<div class="item no-border">
	<input type="text" class="input" id="usernameInput" placeholder="Type your username..."/><!--.input-->
</div><!--.item-->
<div class="item no-border" style="margin-top:-23px;display:none;">
	<input type="password" class="input" id="passwordInput" placeholder="Type your password..."/><!--.input-->
</div><!--.item-->
<div class="item centered heading1 grey2 no-border" id="usernameStatus">Please enter a username.</div><!--.item-->
<div class="item centered">People online</div><!--.item-->

<?php
	echo '<div class="item no-border" id="guestList">';
	$query = mysql_query("SELECT * FROM guests WHERE status > 0");
	echo "<ul class='homeguests'>";
	while($get = mysql_fetch_assoc($query)) {
		$away = $get['status'] == 2 ? " (away)" : ""; 
		echo "<li>{$get['user']}".$away."</li> ";
	}
	echo "</ul>";
	echo '</div><!--.item-->';
}
?>
		</div><!--#messages-->
		<div id="currentImage" class="posted-image"></div>
	</div><!--#content-->