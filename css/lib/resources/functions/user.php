<?php
class User {
	public $error;
	
	public function __construct() {
	
	}
	public function login($user,$pass) {
		$pass = md5($pass);
		$sql = mysql_query("SELECT * FROM users WHERE user='$user'");
		if(mysql_num_rows($sql) > 0) {
			while($get = mysql_fetch_assoc($sql)) {
				$dbuser = $get['user'];
				$dbpass = $get['pass'];
				$dvlevel = $get['level'];
				$dbid = $get['id'];
			}
			if($dbuser == $user && $dbpass == $pass) {
				$_SESSION['user'] = $dbuser;
				$_SESSION['id'] = $dbid;
				$_SESSION['level'] = $dblevel;
				return true;
			} else {
				$this->error = "Wrong username or password.";
				return false;
			}
		} else {
			$this->error = "Wrong username or password.";
			return false;
		}
	}
}
?>