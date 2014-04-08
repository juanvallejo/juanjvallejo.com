<?php
session_start();
include("config.php");

class Guest {
	public $user,$time,$status,$error,$pass;
	
	public function __construct($user) {
		$this->user = $user;
		$this->time = time();
		$this->status = 1;
		$this->error = "Error";
	}
	public function add() {
		$checkSQL = mysql_query("SELECT * FROM guests WHERE user = '$this->user'");
		if(mysql_num_rows($checkSQL) == 0) {
			$checkSavedAccounts = mysql_query("SELECT * FROM savedAccounts WHERE name='$this->user'");
			if(mysql_num_rows($checkSavedAccounts) == 0) {
				if(mysql_query("INSERT INTO guests(user,time,status) VALUES ('$this->user','$this->time','$this->status')")) {
					return true;
				} else {
					$this->error = "Error joining chat.";
					return false;
				}
			} else {
				$this->error = "savedAccountError";
				return false;
			}
		} else {
			$this->error = "That username is currently being used.";
			return false;
		}
	}
	public function addReservedAccount() {
		$sql = mysql_query("SELECT pass FROM savedAccounts WHERE name='$this->user'");
		while($get = mysql_fetch_assoc($sql)) {
			$pass = $get['pass'];
		}
		$encryptedPassword = md5($this->pass);
		if($encryptedPassword == $pass) {
			if(mysql_query("INSERT INTO guests(user,time,status) VALUES ('$this->user','$this->time','$this->status')")) {
				return true;
			} else {
				$this->error = "Error joining chat.";
				return false;
			}
		} else {
			$this->error = "Unable to authenticate, wrong password. Press ESC to cancel";
			return false;
		}
	}
	public function set_session() {
		$sql = mysql_query("SELECT * FROM guests WHERE user='$this->user'");
		while($get = mysql_fetch_assoc($sql)) {
			$session_id = $get['id'];
		}
		if(!empty($this->pass)) {
			$sqlReserved = mysql_query("SELECT * FROM savedAccounts WHERE name='$this->user'");
			while($get = mysql_fetch_assoc($sqlReserved)) {
				$reservedAccountName = $get['name'];
				$isMod = $get['isMod'];
			}
			$name = $reservedAccountName;
			if($isMod) {
				$_SESSION['mod'] = "1";
			}
		} else {
			$name = $this->user;
		}
		$_SESSION['user'] = $name;
		$_SESSION['id'] = $session_id;
		return true;
	}
	public function set_cookie() {
		if(setcookie("session",$_SESSION['id'],time()+600,"/")) {
			return true;
		} else {
			$this->error = "There was an error setting the cookie";
			return false;
		}
	}
}

$guest = new Guest($_POST['user']);
if($_POST['pass']) {
	$guest->pass = $_POST['pass'];
	if($guest->addReservedAccount()) {
		if($guest->set_session()) {
			if($guest->set_cookie()) {
				echo "success";
			} else {
				echo $guest->error;
			}
		} else {
			echo $guest->error;
		}
	} else {
		echo $guest->error;
	}
} else {
	if($guest->add()) {
		if($guest->set_session()) {
			if($guest->set_cookie()) {
				echo "success";
			} else {
				echo $guest->error;
			}
		} else {
			echo $guest->error;
		}
	} else {
		echo $guest->error;
	}
}
?>