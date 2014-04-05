<?php
session_start();
include('db.php');

if($_SESSION['user']) {
	if(session_destroy()) {
		header('location: ../');
	}
}
else {
	header('location: ../');
}
?>