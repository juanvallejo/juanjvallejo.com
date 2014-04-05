<?php
if($link = mysql_connect('127.0.0.1','spujet','metamorph2016') or die(mysql_error())) {
	if(mysql_select_db('spujet_jjv',$link)) return true;
		else {
			echo 'There was an error connecting to the database';
		}
} else {
	die('Unable to connect to the database.'.mysql_error());
}
?>