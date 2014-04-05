<?php
session_start();
include("config.php");

if($_SESSION['user']) {
	$id = $_SESSION['id'];
	if(mysql_query("DELETE FROM guests WHERE id='$id'")) {
		if(session_destroy()) {
			if(isset($_COOKIE['session'])) {
				if(setcookie("session","",time()-1,"/")) {
					echo "success";
				}
			} else {
				echo "success";
			}
		}
	}
} elseif(!$_SESSION['user'] && $_COOKIE['session']) {
	$id = $_COOKIE['session'];
	if(mysql_query("DELETE FROM guests WHERE id='$id'")) {
		if(isset($_COOKIE['session'])) {
			if(setcookie("session","",time()-1,"/")) {
				echo "success";
			}
		}
	}
}
?>