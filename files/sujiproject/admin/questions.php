<?php
include('db_config.php');

$sql = mysql_query("SELECT * FROM questions");
$i = 0;


echo "<script type='text/javascript'>
var init = { 
     'questions': [ ";
     while($get = mysql_fetch_assoc($sql)) {
     $id = $get['id'];
     $answers = array();
     $sql2 = mysql_query("SELECT * FROM options WHERE q_id='$id'");
     	$e = 0;
     	while($fetch = mysql_fetch_array($sql2)) {
     		if($fetch['isImg'] == 1) {
     			$opt = "<img src=\'admin/".$fetch['img']."\' alt=\'image\'/>";
     		} else {
     			$opt = $fetch['opt'];
     		}
     		$answers[$e] = "'".$opt."'";
     		$e++;
    	}
    	$ans = implode(",",$answers);
     	$comma = ",";
     	if($i == mysql_num_rows($sql)) {
     		$comma = "";
     	}
echo	"{
           'question': '".$get['question']."',
           'answers': [".$ans."],
			  'correctAnswer': '".$get['answer']."'
		}".$comma;
		$i++;
	}
echo	"], 
 'resultComments' :  
	  {
		    perfect: 'Albus, is that you?',
			 excellent: 'Outstanding',
			 good: 'Exceeds expectations!',
			 average: 'ok.',
			 bad: 'Well, that was not ok.',
			 poor: 'do well next time!',
			 worst: 'oops better luck next time!'
	  }

 };
 </script>";
?>