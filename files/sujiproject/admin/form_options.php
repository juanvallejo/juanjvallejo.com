<?php
include('db_config.php');

$sql = mysql_query("SELECT * FROM formSettings WHERE id='1'");
$sql2 = mysql_query("SELECT * FROM formInputs");
$arrayOfInputTypes = array();
$arrayOfInputNames = array();
$arrayOfInputPh = array();
$arrayOfInputValues = array();
$i=0;

while($get = mysql_fetch_assoc($sql2)) {
	$arrayOfInputTypes[$i] = "'".$get['type']."'";
	$arrayOfInputNames[$i] = "'".$get['name']."'";
	$arrayOfInputPh[$i] = "'".$get['placeholder']."'";
	$arrayOfInputValues[$i] = "'".$get['value']."'";
	$i++;
}

$arr1 = implode(",",$arrayOfInputTypes);
$arr2 = implode(",",$arrayOfInputNames);
$arr3 = implode(",",$arrayOfInputPh);
$arr4 = implode(",",$arrayOfInputValues);

	echo '<script type="text/javascript">';
while($get = mysql_fetch_assoc($sql)) {
	
	echo	'var formOptions = {
				showForm : '.$get["showForm"].',
				formTitle:"'.$get["formTitle"].'",
		  		formText:"'.$get["formText"].'"
			};';
}
	echo 	'var formInputs = {
				inputNumber:'.mysql_num_rows($sql2).',
				inputTypes:['.$arr1.'],
				inputNames:['.$arr2.'],
				inputPlaceholders:['.$arr3.'],
				inputValues:['.$arr4.']
			};';
	echo '</script>';
?>