<?php
$link = mysql_connect('localhost','spujet','metamorph2016') or die(mysql_error());
if(mysql_select_db('spujet_jjv',$link)) return true;
else {die('There was an error connecting to the database');}
?>
