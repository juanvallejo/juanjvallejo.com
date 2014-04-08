<?php
session_start();
include("config.php");

$sql = mysql_query("SELECT * FROM guests WHERE status > 0");
$num = mysql_num_rows($sql);
echo "<span class='grey2'>People online: </span>";
while($get = mysql_fetch_assoc($sql)) {
	$status = ($get['status'] == 2 ? " [away]" : "");
	echo "<span class='grey2'>({$get['user']}".$status.") </span>";
}
?>