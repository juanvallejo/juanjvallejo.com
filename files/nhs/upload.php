<?php
session_start();
if($_SESSION['user']) {
include('include/db.php');
include('include/header.php');

echo "<div class='form-feedback'>";
class Upload {
	protected $file,$handle;
	
	public function __construct() {
		$this->file = $_FILES['file']['name'];
	}
	public function checkExist() {
		if(!empty($_FILES['file']['name'])) {
			$this->checkFile();
		} else {
			echo "You haven't selected a file yet! :(";
		}
	}
	public function checkFile() {
		$ex = explode(".",$this->file);
		$ex = mb_convert_case($ex[1], MB_CASE_LOWER, "UTF-8");
		if($ex == "csv") {
			$this->fileGet();
		} else {
			echo "Sorry, that filetype is not supported. Please make sure you're uploading a .CSV file.";
		}
	}
	public function fileGet() {
		$this->handle = fopen($_FILES['file']['tmp_name'],"r");
		$array = fgetcsv($this->handle,1000,",");
		if(count($array) == 1) {
			if(!empty($_POST['checkbox'])) {
				if($this->truncateTable("concept_students")) {
					$this->uploadData("Additionally, the previous data has been deleted.");
				} else {
					echo "There was an error overwriting existing data";
				}
			} else {
				$this->uploadData(null);
			}
		} else {
			echo "Error, please make sure you only have one column of data in your .CSV file";
		}
	}
	public function uploadData($status) {
		while(($array = fgetcsv($this->handle,1000,",")) !== false) {
			$sql = mysql_query("INSERT INTO concept_students(student) VALUES ('$array[0]')");
		}
		if($sql) {
			echo "The data was uploaded successfully!".(isset($status) ? " ".$status : "");
		} else {
			echo "There was an error uploading the data :( <br />".mysql_error();
		}
	}
	public function truncateTable($var) {
		if(isset($var)) {
			if(mysql_query("TRUNCATE TABLE $var")) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}

if(isset($_FILES['file'])) {
	$upload = new Upload;
	$upload->checkExist();
}
echo "</div><!--end .form-feedback-->";
?>
<div class="window">
<p class="title" style="margin-bottom:15px;">Upload .CSV file to database</p>
<form method="post" class="form" id="upload_csv" enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']; ?>">
	<input type="file" name="file"/><br />
	<input type="checkbox" name="checkbox" id="checkbox" value="1"/><label for="checkbox"> delete existing data</label><br />
	<input type="submit" value="submit"/>
</form>
</div><!--end .window-->
<div class="window" style="min-height:50px;">
<p style="width:100%; text-align:center;">Note: This script will only update the students table in the database, therefore, any data deleted or replaced will only affect student data.</p>
</div><!--end .window-->
<?php
include('include/footer.php');
} else {
	header('location: ../nhs');
}
?>