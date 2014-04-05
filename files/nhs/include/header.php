<!DOCTYPE html>
<html lang="en-us">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="description" content="Douglas S. Freeman NHS Database"/>
<meta name="keywords" content="concept"/>
<meta name="Author" content="Juan Vallejo (juuanv@gmail.com)"/>
	<title>Welcome <?php echo $_SESSION['user']; ?></title>
<script type="text/javascript" src="css/jquery.min.js"></script>
<script type="text/javascript" src="css/settings.js"></script>
<link rel="stylesheet" type="text/css" href="css/reset.css"/>
<link rel="stylesheet" type="text/css" href="css/settings.css"/>
<link rel="stylesheet" type="text/css" href="css/styles.css"/>
</head>
<body>
<div class="wrapper">
<div class="alert_box">
	<p class="title"></p>
	<p class="message"></p>
</div>
<?php include('include/dialogues.php'); ?>
<div id="top">
	<div class="logo"></div><!--end .logo-->
	<div class="options">
		<ul>
<?php
if($_SESSION['user']) {
	echo "<li>".$_SESSION['user']."</li>";
	echo "<li><a href='include/logout.php'>logout</a></li>";
} else { echo "<li></li>"; } ?>
		</ul>
	</div><!--end .options-->
</div><!--end #top-->
<span id="record_selected_id" class="hidden"></span>
<span id="current_view" class="hidden">Records</span>
<span id="request" class="hidden"></span>