<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="UTF-8"/>
	<title>Test 2adpro [modified]</title>
<link rel='stylesheet' href='css/styles.css' />
<script src='js/jquery.js'></script>
<script src='js/jquery.2adproquiz.js'></script>
<?php include('admin/questions.php');include('admin/form_options.php'); ?>
<script>
$(document).ready(function() {
	$('#quiz-container').ad2profxnz({
		questions: init.questions, 
		resultComments: init.resultComments,
		twitterStatus: 'Woo! I got {score} on the quiz.',
		debugMode:false,
		formSettings:formOptions,
		formInputs:formInputs
	});
});
 </script>
</head>
<body>
<div id='quiz-container'></div><!--#quiz-container-->
</body>
</html>