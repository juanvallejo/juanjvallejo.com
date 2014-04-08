<?php
session_start();
include('db.php');

class Login {
	protected $user, $pass;
	
	public function __construct() {
		$this->user = $_POST['user'];
		$this->pass = $_POST['pass'];
	}
	public function matchDb() {
		$sql = mysql_query("SELECT * FROM `concept_teachers` WHERE name='$this->user'");
		$count = mysql_num_rows($sql);
		if($count != '0') {
			$this->checkDb();
		}
		else {
			die("Invalid login details");
		}
	}
	public function checkDb() {
		$sql = mysql_query("SELECT * FROM `concept_teachers` WHERE name='$this->user'");
		while($get = mysql_fetch_array($sql)) {
			$dbUser = $get['name'];
			$dbPass = $get['pass'];
			$dbLevel = $get['level'];
			$dbstatus = $get['status'];
			$dbId = $get['id'];
		}
		if($this->user == $dbUser && $this->pass == $dbPass) {
			$_SESSION['user'] = $dbUser;
			$_SESSION['level'] = $dbLevel;
			$_SESSION['status'] = $dbstatus;
			$_SESSION['id'] = $dbId;
			echo "success";
		}
		else {
			die("Invalid login details");
		}
	}
}

$login = new Login;
$login->matchDb();
?>