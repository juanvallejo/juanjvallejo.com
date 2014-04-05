<?php
session_start();
include('db.php');

class deleteRecord {
	protected $id, $view, $teacher;
	
	public function __construct() {
		$this->id = $_POST['del_id'];
		$this->view = $_POST['curr_view'];
		$this->teacher = $_SESSION['user'];
	}
	public function removeRecord() {
		$table = "concept_1_".$this->teacher;
		if(mysql_query("DELETE FROM $table WHERE target_student='$this->id'")) {
			$this->removeAverage();
		}
		else {
			die('There was an error removing the data');
		}
	}
	public function removeAverage() {
		if(mysql_query("DELETE FROM concept_average WHERE author='$this->teacher' AND target_student='$this->id'")) {
			echo "deleted";
		}
		else {
			die("Apologies, an error occurred removing the average data. Please contact developer.");
		}
	}
}

class addRecord {
	protected $rating, $comment, $name, $author, $rating2, $context;
	
	public function __construct() {
		$this->rating = $_POST['add_rating'];
		$this->comment = htmlentities($_POST['add_comment'], ENT_QUOTES);
		$this->name = $_POST['add_name'];
		$this->rating2 = $_POST['add_rating2'];
		$this->context = $_POST['add_context'];
	}
	public function addRecord() {
		if(empty($this->comment)) {
			if(mysql_query("INSERT INTO `concept_data` (name, rating, leadership, context) VALUES ('$this->name', '$this->rating', '$this->rating2', '$this->context')")) {
				echo "added";
			}
			else {
				die('Apologies, an error has occurred');
			}
		}
		else {
			if(mysql_query("INSERT INTO `concept_data` (name, rating, comment, author, leadership, context) VALUES ('$this->name', '$this->rating', '$this->comment', '$this->author', '$this->rating2', '$this->context')")) {
				echo "added";
			}
			else {
				die('Apologies, an error has occurred');
			}
		}
	}
}

class addItem {
	protected $name, $table, $target, $pass;
	
	public function __construct() {
		$this->target = $_POST['target'];
		$this->name = $_POST['add_item'];
		$this->pass = $_POST['pass'];
	}
	public function addName() {
		if($this->target == "student") {
			if(mysql_query("INSERT INTO concept_students (student) VALUES ('$this->name')")) {
				echo "added";
			}
			else {
				die('Apologies, a new student could not be added to the database at this time');
			}
		}
		elseif($this->target == "teacher") {
			$table = "concept_1_".$this->name;
			if(mysql_query("INSERT INTO concept_teachers (name, pass) VALUES ('$this->name', '$this->pass')")) {
				if(mysql_query("
				CREATE TABLE IF NOT EXISTS $table (
					`teacher_id` INT( 5 ) NOT NULL AUTO_INCREMENT ,
 					`ethics` INT( 5 ) NOT NULL ,
 					`leadership` INT( 5 ) NOT NULL ,
 					`comment` VARCHAR( 2000 ) NOT NULL ,
 					`context` VARCHAR( 2000 ) NOT NULL ,
 					`target_student` INT( 2 ) NOT NULL ,
					PRIMARY KEY (  `teacher_id` )
				) ENGINE = MYISAM DEFAULT CHARSET = latin1;")) {
					echo "added";
				}
				else {
					die('Warning, the teacher account has been corrupted');
				}
			}
			else {
				die("Apologies, an error occurred adding a new teacher to the database");
			}
		} else {
			die('Apologies, the request could not be completed because an invalid request was sent to the server');
		}
	}
}

class editRecord {
	protected $rating, $comment, $name, $id, $rating2, $context;
	
	public function __construct() {
		$this->rating = $_POST['edit_rating'];
		$this->comment = htmlentities($_POST['edit_comment'], ENT_QUOTES);
		$this->name = $_POST['edit_name'];
		$this->context = htmlentities($_POST['edit_context'], ENT_QUOTES);
		$this->rating2 = $_POST['edit_rating2'];
		$this->id = $_POST['edit_id'];
	}
	
	public function editRecord() {
		$table = "concept_1_".$_SESSION['user']; $author = $_SESSION['user'];
		if(empty($this->name)) {
			if(mysql_query("
			INSERT INTO $table (ethics,leadership,comment,context,target_student)
			VALUES ('$this->rating', '$this->rating2', '$this->comment', '$this->context', '$this->id')
			")) {
				if(mysql_query("INSERT INTO concept_average (ethics,leadership,comment,context,target_student,author) 
				VALUES ('$this->rating', '$this->rating2','$this->comment', '$this->context', '$this->id', '$author')")) {
					echo "changed";
				}
				else {
					die("Warning: data corruption. Error entering data during phase two.");
				}
			}
			else {
				die('Apologies, and error has occurred.');
			}
		} else {
			if(mysql_query("
			UPDATE $table 
			SET ethics='$this->rating', leadership='$this->rating2', comment='$this->comment', context='$this->context'
			WHERE target_student='$this->id'
			")) {
				if(mysql_query("UPDATE concept_average 
				SET ethics='$this->rating',leadership='$this->rating2', comment='$this->comment', context='$this->context'
				WHERE target_student='$this->id' AND author='$author'")) {
					echo "changed";
				}
				else {
					die("Warning: data corruption. Error entering data during phase two.");
				}
			}
			else {
				die('Apologies, an error has occurred');
			}
		}
	}
}

class delItem {
	protected $id, $view, $teacher;
	
	public function __construct() {
		$this->id = $_POST['del_item_id'];
		$this->view = $_POST['view'];
	}
	public function delData() {
		if($this->view == "Students") {
			if(mysql_query("DELETE FROM concept_students WHERE student_id='$this->id'")) {
				if(mysql_query("DELETE FROM concept_average WHERE target_student='$this->id'")) {
					echo "success";
				}
				else {
					die("Your request has been completed. However, there was no data found to delete");
				}
			}
			else {
				die("Apologies, your request could not be completed at this time.");
			}
		}
		elseif($this->view == "Teachers") {
			$sql = mysql_query("SELECT name FROM concept_teachers WHERE id='$this->id'");
			while($get = mysql_fetch_array($sql)) {
				$this->teacher = $get['name'];
			}
			$this->handleTeacher();
		}
		else {
			die("Apologies, there was an error parsing the data");
		}
	}
	public function handleTeacher() {
		$table = "concept_1_".$this->teacher;
		if(mysql_query("DELETE FROM concept_average WHERE author='$this->teacher'")) {
			if(mysql_query("DROP TABLE $table")) {
				if(mysql_query("DELETE FROM concept_average WHERE author='$this->teacher'")) {
					if(mysql_query("DELETE FROM concept_teachers WHERE id='$this->id'")) {
						echo "success";
					}
					else {
						die('While the teacher data deleted successfully, the teacher could not be removed');
					}
				}
				else {
					die('Unable to delete pool data from average information');
				}
			}
			else {
				die('The records for '.$this->teacher.' could not be deleted.');
			}
		} else {
			die("Could not remove data");
		}
	}
}

class massDel {
	protected $string;
	
	public function __construct() {
		if(empty($_POST['teacher_mass_del'])) {
			$this->string = $_POST['student_mass_del'];
		} else {
			$this->string = $_POST['teacher_mass_del'];
		}
	}
	public function delItems() {
		$a = explode("&", $this->string);
		$count = count($a);
		for($i=0;$i<$count;$i++) {
			$b = split("=", $a[$i]);
			$sql = mysql_query("DELETE FROM concept_students WHERE student_id = ".$b[1]);
		}
		if($sql) {
			echo "success";
		} else {
			die("There was an error fullfilling your request.");
		}
	}
	public function teacherDelItems() {
		$a = explode("&", $this->string);
		$count = count($a);
		for($i=0;$i<$count;$i++) {
			$b = split("=", $a[$i]);
			$sql1 = mysql_query("DROP TABLE concept_1_".$b[1]);
		}
		if($sql1) {
			for($i=0;$i<$count;$i++) {
				$b = split("=", $a[$i]);
				$sql2 = mysql_query("DELETE FROM concept_teachers WHERE name = '".$b[1]."'");
			}
		}
		echo "success";
	}
}

class lockUpdate {
	protected $id, $target;
	
	public function __construct() {
		$this->id = $_POST['lock_id'];
		$this->target = $_POST['target'];
	}
	public function updateStatus() {
		if(empty($this->target)) {
			$session = $_SESSION['user'];
		} else {
			$session = $this->target;
		}
		if($this->id == "1") {
			if(mysql_query("UPDATE concept_teachers SET status='1' WHERE name='$session'")) {
				echo "success";
			} else {
				die("There was an error updating the lock status");
			}
		}
		elseif($this->id == "unlock") {
			if(mysql_query("UPDATE concept_teachers SET status='0' WHERE name='$session'")) {
				echo "success";
			} else {
				die("There was an error updating the lock status");
			}
		}
	}
}

if(!empty($_POST['del_id'])) {
	$delete = new deleteRecord;
	$delete->removeRecord();
}
elseif(!empty($_POST['add_name'])) {
	$add = new addRecord;
	$add->addRecord();
}
elseif(!empty($_POST['edit_id'])) {
	$edit = new editRecord;
	$edit->editRecord();
}
elseif(!empty($_POST['add_item'])) {
	$add = new addItem;
	$add->addName();
}
elseif(!empty($_POST['del_item_id'])) {
	$del = new delItem;
	$del->delData();
}
elseif(!empty($_POST['student_mass_del'])) {
	$mass_del = new massDel;
	$mass_del->delItems();
}
elseif(!empty($_POST['teacher_mass_del'])) {
	$mass_del = new massDel;
	$mass_del->teacherDelItems();
}
elseif(!empty($_POST['lock_id'])) {
	$lock = new lockUpdate;
	$lock->updateStatus();
}
else {
	die('Parse error. Check DOM id name');
}
?>