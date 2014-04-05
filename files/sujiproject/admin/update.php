<?php
$que1 = $_POST['que1'];
$ans11 = $_POST['ans11'];
$ans12 = $_POST['ans12'];
$ans13 = $_POST['ans13'];
$ans14 = $_POST['ans14'];
$rans1 = $_POST['rans1'];
$que2 = $_POST['que2'];
$ans21 = $_POST['ans21'];
$ans22 = $_POST['ans22'];
$ans23 = $_POST['ans23'];
$ans24 = $_POST['ans24'];
$rans2 = $_POST['rans2'];
$que3 = $_POST['que3'];
$ans31 = $_POST['ans31'];
$ans32 = $_POST['ans32'];
$ans33 = $_POST['ans33'];
$ans34 = $_POST['ans34'];
$rans3 = $_POST['rans3'];

$myFile = "init.js";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = "var init = { 
     'questions': [ 
       {
           'question': '$que1',
           'answers': ['$ans11','$ans12','$ans13','$ans14'],
			  'correctAnswer': '$rans1'
       }, \n";
fwrite($fh, $stringData);
$stringData = " 
     
       {
           'question': '$que2',
           'answers': ['$ans21','$ans22','$ans23','$ans24'],
			  'correctAnswer': '$rans2'
       }, \n";
fwrite($fh, $stringData);
$stringData = " 
 
       {
           'question': '$que3',
           'answers': ['$ans31','$ans32','$ans33','$ans34'],
			  'correctAnswer': '$rans3'
       }
       	], \n";
fwrite($fh, $stringData);
$stringData = " 'resultComments' :  
	  {
		    perfect: 'Albus, is that you?',
			 excellent: 'Outstanding',
			 good: 'Exceeds expectations!',
			 average: 'ok.',
			 bad: 'Well, that was not ok.',
			 poor: 'do well next time!',
			 worst: 'oops better luck next time!'
	  }

 };\n";
if(fwrite($fh, $stringData)) {
	header("location: home.php?s=success");
} else {
	header("location: home.php?s=error");
}
fclose($fh);
?>