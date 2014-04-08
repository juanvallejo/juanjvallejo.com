<?php
$commandList = array(
'delete',
'save',
'op',
'deop',
'list',
'help',
'mute',
'unmute',
'to'
);

class Command {
	public $command,$object,$objectId,$error,$invalidCommand="If you want to type incomplete commands, be my guest, just don't ma";
	
	public function __construct($command) {
		$command = explode(" ",$command);
		$this->command = $command[0];
		$this->object = $command[1];
		$this->objectId = $command[2];
		$this->objectExtra = $command[3];
	}
	public function doCommand() {
		$user = $_SESSION['user'];
		$getSql = mysql_query("SELECT isMod FROM savedAccounts WHERE name='$user'");
		if(mysql_num_rows($getSql) > 0) {
			while($get = mysql_fetch_assoc($getSql)) {
				$modStatus = $get['isMod'];
			}
			if($modStatus > 0) {
				$isMod = true;
			} else {
				$isMod = false;
			}
		} else {
			$isMod = false;
		}
		if($this->command == "delete" && $isMod) {
			if($this->object == "post") {
				if($this->deletePost()) {
					return true;
				} else {
					return false;
				}
			} elseif($this->object == "user") {
				if($this->deleteAccount()) {
					return true;
				} else {
					return false;
				}
			} else {
				$this->error = $this->invalidCommand;
				return false;
			}
		} elseif($this->command == "save") {
			if($this->saveAccount()) {
				return true;
			} else {
				$this->error = "Unable to save account";
				return false;
			}
		} elseif($this->command == "op" && $isMod) {
			if($this->object != "") {
				if($this->modAccount()) {
					return true;
				} else {
					return false;
				}
			} else {
				$this->error = $this->invalidCommand;
				return false;
			}
		} elseif($this->command == "deop" && $isMod) {
			if($this->object != "") {
				if($this->demoteAccount()) {
					return true;
				} else {
					return false;
				}
			} else {
				$this->error = $this->invalidCommand;
				return false;
			}
		} elseif($this->command == "list") {
			if($this->object == "accounts") {
				if($this->listAccountData()) {
					return false;
				} else {
					return false;
				}
			} else {
				$this->error = $this->invalidCommand;
				return false;
			}
		} elseif($this->command == "help") {
			if($this->object == "") {
				$this->listHelp();
				return false;
			} else {
				$this->error = "That's the WRONG way to spell just '/help'";
				return false;
			}
		} elseif($this->command == "mute" && $isMod) {
			if($this->object != "") {
				if($this->addAttr('mute')) {
					return true;
				} else {
					return false;
				}
			} else {
				$this->error = "To mute the entire world, I must first be self-aware; for now, try typing a user's name to mute";
				return false;
			}
		} elseif($this->command == "unmute" && $isMod) {
			if($this->object != "") {
				if($this->addAttr('unmute')) {
					return true;
				} else {
					return false;
				}
			} else {
				$this->error = "Aww, look at you being all silly like... not providing anyone's name after the word UNMUTE";
				return false;
			}	
		} elseif($this->command == "to") {
			if($this->object != "") {
				$this->pushPrivateMessage();
			} else {
				$this->error = "You must provide a someone's name if you expect me to send anyone a message";
				return false;
			}
		} else {
			$this->error = "Maybe when you're older";
			return false;
		}
	}
	public function deletePost() {
		if($this->objectId == "all") {
			if(mysql_query("TRUNCATE TABLE chat")) {
				return true;
			} else {
				$this->error = "Error deleting all posts. ".mysql_error();
				return false;
			}
		} else {
			if(mysql_query("DELETE FROM chat WHERE id='$this->objectId'")) {
				return true;
			} else {
				$this->error = "Error executing command";
				return false;
			}
		}
	}
	public function deleteAccount() {
		$sql = mysql_query("SELECT * FROM savedAccounts WHERE name='$this->objectId'");
		if(mysql_num_rows($sql) > 0) {
			if(mysql_query("DELETE FROM savedAccounts WHERE name='$this->objectId'")) {
				return true;
			} else {
				$this->error = "There was an error deleting that account. ".mysql_error();
				return false;
			}
		} else {
			$this->error = "I can't delete the entire world, just accounts saved to this chat, for now";
			return false;
		}
	}
	public function saveAccount() {
		$user = $_SESSION['user'];
		$pass = md5($this->object);
		$sqlRepeatCheck = mysql_query("SELECT * FROM savedAccounts WHERE name='$user'");
		if(mysql_num_rows($sqlRepeatCheck) == 0) {
			if(mysql_query("INSERT INTO savedAccounts (name,pass) VALUES ('$user','$pass')")) {
				return true;
			} else {
				return false;
			}
		} else {
			if(mysql_query("UPDATE savedAccounts SET pass='$pass' WHERE name='$user'")) {
				return true;
			} else {
				return false;
			}
		}
	}
	public function modAccount() {	
		$sql = mysql_query("SELECT isMod FROM savedAccounts WHERE name='$this->object'");
		if(mysql_num_rows($sql) > 0) {
			while($get = mysql_fetch_assoc($sql)) {
				$getModStatus = $get['isMod'];
			}
			if($getModStatus != "2") {
				if($this->objectId == "level") {
					$this->error = "test";
					return false;
				} else {
					if(mysql_query("UPDATE savedAccounts SET isMod='1' WHERE name='$this->object'")) {
						if($this->pushMessage("[mod] ".$_SESSION['user']." has made ".$this->object." a moderator")) {
							return true;
						} else {
							return false;
						}
					} else {
						$this->error = "There was an error modding that account. ".mysql_error();
						return false;
					}
				}
			} else {
				$this->error = "To op the op-er would be to dress the dresser";
				return false;
			}
		} else {
			$this->error = "I don't always like making people mods... but when I do, their account has to actually exist.";
			return false;
		}
	}
	public function demoteAccount() {
		$sql = mysql_query("SELECT isMod FROM savedAccounts WHERE name='$this->object'");
		if(mysql_num_rows($sql) > 0) {
			while($get = mysql_fetch_assoc($sql)) {
				$getModStatus = $get['isMod'];
			}
			if($getModStatus != "2") {
				if(mysql_query("UPDATE savedAccounts SET isMod='0' WHERE name='$this->object'")) {
					if($this->pushMessage("[mod] ".$_SESSION['user']." has demoted ".$this->object)) {
						return true;
					} else {
						return false;
					}
				} else {
					$this->error = "There was an error demoting that account. ".mysql_error();
					return false;
				}
			} else {
				$this->error = "I don't think Juan would like it if I did that";
				return false;
			}
		} else {
			$this->error = "I can't deop everybody in the world... I can however deop users that actuslly exist on this chat as saved accounts, and you";
			return false;
		}
	}
	public function listAccountData() {
		if($this->objectId == "mod") {
			$sql = mysql_query("SELECT name FROM savedAccounts WHERE isMod > 0");
			if(mysql_num_rows($sql) > 0) {
				$string;
				while($get = mysql_fetch_assoc($sql)) {
					$this->error = $get['name'];
				}
			} else {
				$this->error = "There are currently no moderator accounts";
			}
			return true;
		} else {
			$this->error = "Error: partial command provided";
			return false;
		}
	}
	public function listHelp() {
		$isSaved = false; $isMod = false;
		$user = $_SESSION['user'];
		$sql = mysql_query("SELECT * FROM savedAccounts WHERE name='$user'");
		while($get = mysql_fetch_assoc($sql)) {
			$modStatus = $get['isMod'];
		}
		$log = "<p>Type '/to USER_NAME' to send that person a private message.</p>";
		$log .= "<p>Paste a URL into the chat to share an image or a link.</p>";
		$log .= "<p>Type [LINK_TITLE] after your link/URL to give it a name</p>";
		if(mysql_num_rows($sql) > 0) {
			$log .= "<p style='margin-top:10px;'>Your account is saved.</p>";
		} else {
			$log .= "<p style='margin-top:10px;'>Your account is not saved.</p>";
			$log .= "Type '/save' to save your account and create a password for it";
		}
		if($modStatus > 0) {
			$log .= "<p>You are a moderator.</p>";
			$log .= "<p style='margin-top:10px;'>Use shift+click on a post to get its id.</p>";
			$log .= "<p>Type '/delete post post_id' to delete a post.</p>";
			$log .= "<p>Type '/mute user_name' to mute others.</p>";
			$log .= "Type '/unmute user_name' to undo the previous action";
		}
		$this->error = $log;
		return false;
	}
	public function addAttr($data) {
		$grabGuests = mysql_num_rows(mysql_query("SELECT id FROM guests WHERE user='$this->object'"));
		if($grabGuests) {
			if($data == "mute") {
				if(mysql_query("UPDATE guests SET attributes='1' WHERE user='$this->object'")) {
					if($this->pushMessage("[mod] ".$_SESSION['user']." has muted ".$this->object)) {
						return true;
					} else {
						return false;
					}
				} else {
					$this->error = "There was an error completing your request ".mysql_error();
					return false;
				}
			} elseif($data == "unmute") {
				if(mysql_query("UPDATE guests SET attributes='0' WHERE user='$this->object'")) {
					if($this->pushMessage("[mod] ".$_SESSION['user']." has unmuted ".$this->object)) {
						return true;
					} else {
						return false;
					}
				} else {
					$this->error = "There was an error completing your request ".mysql_error();
					return false;
				}
			}
		} else {
			$this->error = "Looks like that user has left the chat, has a different spelling to their name, or only existed in your head";
			return false;
		}
	}
	public function pushMessage($string) {
		$time = time();
		$author = "<span class=\'red\'>[server]</span>";
		$author_id = $_SESSION['id'];
		$message = "<span class=\'red\'>".$string."</span>";
		if(mysql_query("INSERT INTO chat (author,message,author_id,time) VALUES ('$author','$message','$author_id','$time')")) {
			return true;
		} else {
			$this->error = "There was an error retrieving a response from the server ".mysql_error();
			return false;
		}
	}
	public function pushPrivateMessage() {
		$sql = mysql_query("SELECT id FROM guests WHERE user='$this->object'");	
		if(mysql_num_rows($sql) > 0) {
			while($get = mysql_fetch_assoc($sql)) {
				$userId = $get['id'];
			}
			$this->error = "commandDisplayPmScreen:".$userId.":".$this->object;
			return false;
		} else {
			$this->error = "The user you are trying to make me send a lovely message to DOESN'T exist..";
			return false;
		}
	}
}
?>