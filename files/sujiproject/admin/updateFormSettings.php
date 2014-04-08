<?php
include("db_config.php");

class Form {
	public $showForm,$formTitle,$formText,$error;
	
	public function __construct() {
		$this->showForm = isset($_POST['showForm']) ? $_POST['showForm'] : "false";
		$this->formTitle = $_POST['formTitle'];
		$this->formText = $_POST['formText'];
	}
	public function updateForm() {
		if(mysql_query("UPDATE formSettings SET showForm='$this->showForm',formTitle='$this->formTitle',formText='$this->formText' WHERE id='1'")) {
			return true;
		} else {
			return false;
		}
	}
	public function updateField() {
		$id = $_POST['formUpdateInputId'];
		$type = $_POST['inputType'];
		$name = htmlentities($_POST['inputName'],ENT_QUOTES);
		$placeholder = htmlentities($_POST['inputPlaceholder'],ENT_QUOTES);
		$value = htmlentities($_POST['inputValue'],ENT_QUOTES);
		if(mysql_query("UPDATE formInputs SET type='$type',name='$name',placeholder='$placeholder',value='$value' WHERE id='$id'")) {
			return true;
		} else {
			return false;
		}
	}
	public function addField() {
		if(mysql_query("INSERT INTO formInputs (type,name,placeholder,value) VALUES ('text','inputNameNoSpaces','Input default text','input value')")) {
			return true;
		} else {
			return false;
		}
	}
	public function delField() {
		$id = $_GET['deleteInputId'];
		if(mysql_query("DELETE FROM formInputs WHERE id='$id'")) {
			return true;
		} else {
			return false;
		}
	}
	public function addQuestion() {
		if(mysql_query("INSERT INTO questions (question,answer) VALUES ('New question','1')")) {
			$id = mysql_insert_id();
			for($i=0;$i<4;$i++) {
				$writeOpt = mysql_query("INSERT INTO options (opt,q_id) VALUES ('Untitled option','$id')");
			}	
			if($writeOpt) {
				return true;
			} else {
				$this->error = mysql_error();
				return false;
			}
		} else {
			return false;
		}
	}
	public function addImg() {
		$optionId = $_POST['getOptionId'];
		$filename = $_FILES['imageToUse']['name'];
		$fileTemp = $_FILES['imageToUse']['tmp_name'];
		if(move_uploaded_file($fileTemp,"quiz_images/".$filename)) {
			$url = "quiz_images/".$filename;
			if(mysql_query("UPDATE options SET img='$url',isImg='1' WHERE id='$optionId'")) {
				return true;
			} else {
				$this->error = "There was an error. ".mysql_error();
				return false;
			}
		} else {
			$this->error = "There was an error uploading the image";
			return false;
		}
	}
	public function removeImg() {
		$id = $_GET['removeImageFromOption'];
		$sql = mysql_query("SELECT img FROM options WHERE id='$id'");
		while($get = mysql_fetch_assoc($sql)) {
			$filepath = $get['img'];
		}
		if(unlink($filepath)) {
			if(mysql_query("UPDATE options SET isImg='0',img='' WHERE id='$id'")) {
				return true;
			} else {
				$this->error = "There was an error updating this question. ".mysql_error();
				return false;
			}
		} else {
			$this->error = "There was an error removing the image. ";
			return false;
		}
	}
	public function updateQuestion() {
		$optionId = $_POST['optionId'];
		$options = $_POST['option'];
		$questionId = $_POST['questionId'];
		$question = $_POST['question'];
		$answer = $_POST['answer'];
		if(mysql_query("UPDATE questions SET question='$question',answer='$answer' WHERE id='$questionId'")) {
			for($i=0;$i<count($options);$i++) {
				$opt = $options[$i];
				$id = $optionId[$i];
				$do = mysql_query("UPDATE options SET opt='$opt' WHERE id='$id'");
			}
			if($do) {
				return true;
			} else {
				$this->error = "An error occurred. ".mysql_error();
				return false;
			}
		} else {
			$this->error = "An error occurred. ".mysql_error();
			return false;
		}
	}
	public function deleteQuestion() {
		$id = $_GET['deleteQuestion'];
		if(mysql_query("DELETE FROM options WHERE q_id='$id'")) {
			if(mysql_query("DELETE FROM questions WHERE id='$id'")) {
				return true;
			} else {
				$this->error = "An error occurred. ".mysql_query();
				return false;
			}
		} else {
			$this->error = "An error occurred. ".mysql_query();
			return false;
		}
	}
}

$form = new Form();
if(isset($_POST['formTitle'])) {
	if($form->updateForm()) {
		header("location: home.php?s=success");
	} else {
		header("location: home.php?s=formError");
	}
} elseif(isset($_POST['add_new_input'])) {
	if($form->addField()) {
		header("location: home.php?s=success");
	} else {
		header("location: home.php?s=formError");
	}
} elseif(isset($_GET['deleteInputId'])) {
	if($form->delField()) {
		header("location: home.php?s=success");
	} else {
		header("location: home.php?s=formError");
	}
} elseif(isset($_POST['formUpdateInputId'])) {
	if($form->updateField()) {
		header("location: home.php?s=success");
	} else {
		header("location: home.php?s=formError");
	}
} elseif(isset($_POST['add_new_question'])) {
	if($form->addQuestion()) {
		header("location: home.php?s=success");
	} else {
		header("location: home.php?s=".$form->error);
	}
} elseif(isset($_POST['getOptionId'])) {
	if($form->addImg()) {
		header("location: home.php?s=success");
	} else {
		header("location: home.php?s=".$form->error);
	}
} elseif(isset($_GET['removeImageFromOption'])) {
	if($form->removeImg()) {
		header("location: home.php?s=success");
	} else {
		header("location: home.php?s=".$form->error);
	}
} elseif(isset($_POST['option'])) {
	if($form->updateQuestion()) {
		header("location: home.php?s=success");
	} else {
		header("location: home.php?s=".$form->error);
	}
} elseif(isset($_GET['deleteQuestion'])) {
	if($form->deleteQuestion()) {
		header("location: home.php?s=success");
	} else {
	header("location: home.php?s=".$form->error);
	}
} else {
	header("location: home.php?s=formError");
}
?>