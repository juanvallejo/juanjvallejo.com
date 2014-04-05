<?php
if(isset($_FILES['file'])) {
	include('css/data/class.php');
	$do = new Core;
	$do->parseFile();
}
?>
<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="UTF-8"/>
	<title>DocScript</title>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="css/settings.js"></script>
<link rel="stylesheet" href="css/reset.css"/>
<link rel="stylesheet" href="css/styles.css"/> 
</head>
<body>
<div id="wrapper">
	<div class="ui-basic ui-box ui-shadow border-radius-4">
		<div class="ui-basic ui-bg"></div><!--end .ui-bg-->
		<div class="ui-basic ui-status">
			<span>Please select a file</span>
			<div class="basic-ui ui-bg"></div><!--end .ui-bg-->
		</div><!--end .status-->
		<div id="upload" class="ui-basic ui-button border-radius-4">
			upload
			<div class="ui-basic ui-bg"></div><!--end .ui-bg-->
		</div><!--end .ui-button-->
		<form action="#" method="post" enctype="multipart/form-data" id="form_file">
			<input type="file" class="ui-filechooser" name="file" id="choose_file"/>
		</form>
	</div><!--end .ui-box-->
	<div class="ui-basic ui-content border-radius-4" id="content"></div><!--end .ui-content-->
</div><!--end #wrapper-->
</div><!--end .ui-basic-->
</body>
</html>