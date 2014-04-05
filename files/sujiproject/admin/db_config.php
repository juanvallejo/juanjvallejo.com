<?php
$link = mysql_connect('localhost','spujet','CAB:website12') or die(mysql_error());
$db = mysql_select_db('spujet_quiz',$link) or die(mysql_error());
?>