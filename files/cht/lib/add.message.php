<?php
session_start();
include("config.php");
include("chat.commands.php");

class Message {
	public $author,$message,$timestamp,$author_id,$error;
	
	public function __construct($message) {
		$this->author = $_SESSION['user'];
		$this->message = htmlentities($message,ENT_QUOTES);
		$this->timestamp = time();
		$this->author_id = $_SESSION['id'];
	}
	public function push() {
		$tempSql = mysql_query("SELECT attributes FROM guests WHERE id='$this->author_id'");
		while($fetch = mysql_fetch_assoc($tempSql)) {
			$attr = $fetch['attributes'];
		}
		if($attr == 1) {
			$this->error = "You cannot currently send messages as your account has been muted";
			return false;
		} else {
			$sql = mysql_query("SELECT isMod FROM savedAccounts WHERE name='$this->author'");
			while($get = mysql_fetch_assoc($sql)) {
				$modStatus = $get['isMod'];
			}
			if(mysql_num_rows($sql) > 0 && $modStatus) {
				if($modStatus == 3) {
					$author = "<div class=\'adminCrown\'>".$this->author."</div>";
				} else {
					$author = "<span class=\'adminColor\'>[mod]</span> ".$this->author;
				}
			} else {
				$author = $this->author;
			}
			if(isset($_COOKIE['session'])) {
				if(mysql_query("INSERT INTO chat(author,message,author_id,time) VALUES ('$author','$this->message','$this->author_id','$this->timestamp')")) {
					if(setcookie("session",$_SESSION['id'],time()+600,"/")) {
						if(mysql_query("UPDATE guests SET time='$this->timestamp',status='1' WHERE id = '$this->author_id'")) {
							return true;
						}
					} else {
						$this->error = "Error creating cookie";
						return false;
					}
				} else {
					$this->error = "Error. ".mysql_error();
					return false;
				}
			} else {
				$this->error = "Your session has expired, please refresh the page";
				return false;
			}
		}
	}
	public function pushPm() {
		$author = "<span class=\'light_blue\'>".$this->author."</span>";
		$recipient = $_POST['recipient'];
		$formattedRecipient = "-".$recipient."-,-".$this->author_id."-,";
		$sql = mysql_query("SELECT user FROM guests WHERE id='$recipient'");
		if(mysql_num_rows($sql) > 0) {
			while($get = mysql_fetch_assoc($sql)) {
				$user = $get['user'];
			}
			$message = "<span class=\'light_blue\'>[from ".$this->author." to ".$user."] ".$this->message."</span>";
			if(mysql_query("INSERT INTO chat (author,recipients,message,author_id,time) VALUES ('$author','$formattedRecipient','$message','$this->author_id','$this->timestamp')")) {
				return true;
			} else {
				$this->error = "There was an error sending your private message";
				return false;
			}
		} else {
			$this->error = "I was unable to send your message, that user is now offline";
			return false;
		}
	}
}

$message = new Message($_POST['message']);
if($_POST['recipient']) {
	if($message->pushPm()) {
		echo "Your message has been sent";
	} else {
		echo $message->error;
	}
} else {
	$explode = explode("/",$message->message);
	if($explode[1] != "" && $explode[0] == "") {
		$command = explode(" ",$explode[1]);
		if(in_array($command[0],$commandList)) {
			$action = new Command($explode[1]);
			if($action->doCommand()) {
				echo "commandSuccess";
			} else {
				echo $action->error;
			}
		} else {
			if($message->push()) {
				echo "success";
			} else {
				echo $message->error;
			}
		}
	} else {
		if($message->push()) {
			echo "success";
		} else {
			echo $message->error;
		}
	}
}
?>