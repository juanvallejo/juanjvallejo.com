<?php
include("header.php");
include("sidebar.php");
include("function.php");
include("db_config.php");
$success = $_GET['s'];
$edit_err="";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script language="javascript" src="js/util.js"></script>
<link rel="stylesheet" href="css/styles.css"/>
<script>
function deleteInput(id) {
	window.location = "updateFormSettings.php?deleteInputId="+id;
}
function addImage() {
	$('#overlay').fadeIn('fast');
		$('#imgBox').fadeIn('fast');
}
function removeImg(id) {
	window.location = "updateFormSettings.php?removeImageFromOption="+id;
}
function deleteQuestion(id) {
	window.location = "updateFormSettings.php?deleteQuestion="+id;
}
window.onload = function() {
	var form = document.addImgForm;
	var formReady = false;
	var imgBox = document.getElementById("imgBox");
	var closeButton = imgBox.getElementsByClassName("close").item(0);
	closeButton.onclick = function() {
		$('#overlay').fadeOut('fast');
		$('#imgBox').fadeOut('fast');
	};
	form.select_question.onchange = function() {
		var id = this.value;
		var load = new Load();
		load.file("loadQuestionOptions.php",id);
	};
	form.imageToUse.onchange = function() {
		formReady = true;
	}
	$('#optFormOption').live("change",function() {
		if($(this).val() != 0) {
			if(document.getElementById('image_to_use').value != "") {
				formReady = true;
			} else {
				formReady = false;
			}
			$('#getOptionId').val($(this).val());
		} else {
			formReady = false;
		}
	});
	$('#saveImageChanges').live("click",function() {
		if(formReady) {
			$('#addImgForm').submit();
		} else {
			alert("You have missing fields.");
		}
	});
	
function Load() {
	this.file = function(url,data) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST",url,true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send("q_id="+data);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("imgBoxResponse").innerHTML = xhr.responseText;
			}
		}
	}	
}
};
</script>
</head>
<body>
<div id="overlay"></div><!--#overlay-->
<div id="imgBox">
	<div class="close">&times;</div><!--.close-->
	<p class="title" style="margin-bottom:0;">Add An Image Option</p>
<?php
	if($success == "success") {
		echo "<p style='color:#cd3700;'>Your changes have been saved.</p>";
	} else {
		echo "<p style='margin:0;float:right;color:#cd3700;'>".urldecode($success)."</p>";
	}
?>
	<div class="content-box-content">
		<form action="updateFormSettings.php" method="post" enctype="multipart/form-data" name="addImgForm" id="addImgForm">
			<input type="file" name="imageToUse" id="image_to_use" />
			<select name="select_question" style="max-width:200px;">
				<option>Choose a question</option>
			<?php
				$sql = mysql_query("SELECT * FROM questions");
				while($get = mysql_fetch_assoc($sql)) {
					echo "<option name='chosen_question' value='".$get['id']."'>".$get['question']."</option>";
				}
			?>
			</select>
			<input type="hidden" id="getOptionId" name="getOptionId"/>
		</form>
	</div><!--.content-box-content-->
	<div class="content-box-content">
		<div id="imgBoxResponse"><p style="width:100%;text-align:center;">Please select a question.</p></div>
	</div><!--.content-box-content-->
</div><!--#imgBox-->
 <div id="main-content">
            <!-- Main Content Section with everything -->
            <!-- Page Head -->
            <h2>
                Welcome <?php echo $_SESSION['s_name']; ?></h2>
				
                <!-- End .content-box-header -->
                <div class="content-box-content">
                	<div class="form-options">
                		<form name="form" action="updateFormSettings.php" method="post">
        <?php
        	$sql = mysql_query("SELECT * FROM formSettings WHERE id='1'");
        			while($get = mysql_fetch_assoc($sql)) {
        			$checked = ($get["showForm"] == 'true' ? "checked='checked'" : "");
					echo	'<p class="title">Form Settings</p>
							<p>Show the form: <input type="checkbox" value="true" '.$checked.' name="showForm"/><p>
							<p>Form page title: <input type="text" value="'.$get["formTitle"].'" name="formTitle"/></p>
							<p>Form page status text: <input type="text" value="'.$get["formText"].'" name="formText"/></p>';
					}
		?>					<input type="submit" value="Update"/>
						</form>
					</div><!--.form-options-->
                </div><!--.content-box-content-->
                <div class="content-box-content">
                	<div class="form-options">
                	<p class="title">Form Content</p>
                	<input type="text" value="Input type" class="inputHeader" disabled="disabled"/>
                	<input type="text" value="Input name" class="inputHeader" disabled="disabled"/>
                	<input type="text" value="Input default text" class="inputHeader" disabled="disabled"/>
                	<input type="text" value="Input value" class="inputHeader" disabled="disabled"/>
        <?php
        	$sql = mysql_query("SELECT * FROM formInputs");
        			while($get = mysql_fetch_assoc($sql)) {
					echo	'<form name="form" action="updateFormSettings.php" method="post">
								<input type="text" name="inputType" value="'.$get["type"].'"/>
								<input type="text" name="inputName" value="'.$get["name"].'"/>
								<input type="text" name="inputPlaceholder" value="'.$get["placeholder"].'"/>
								<input type="text" name="inputValue" value="'.$get["value"].'"/>
								<input type="hidden" name="formUpdateInputId" value="'.$get["id"].'"/>
								<input type="submit" value="Update"/>
								<input type="button" value="Delete" onclick="deleteInput('.$get["id"].');"/>
							</form>';
					}
		?>					
						<form action="updateFormSettings.php" method="post">
							<input type="hidden" name="add_new_input" value="true"/>							
							<input type="submit" value="Add new field"/>
						</form>
					</div><!--.form-options-->
                </div><!--.content-box-content-->
                <div class="content-box-content">
                	<div class="form-options">
                		<p class="title">Form Questions</p>
                		<table class="myTable">
                		<tr><th>Question</th><th>Option 1</th><th>Option 2</th><th>Option 3</th><th>Option 4</th><th>Ans</th></tr>
        <?php
        	$sql = mysql_query("SELECT * FROM questions") or die(mysql_error());
        	
        			while($get = mysql_fetch_assoc($sql)) {
        			$i = 0;
        			$id = $get['id'];
        			$sql2 = mysql_query("SELECT * FROM options WHERE q_id='$id'");
        			echo	'<form name="form" action="updateFormSettings.php" method="post">';
					echo	'<tr><td><input type="text" name="question" value="'.$get['question'].'"/></td>';
						while($fetch = mysql_fetch_assoc($sql2)) {
					if($fetch['isImg'] == 1) {
					echo		'<td><input type="button" value="Remove image" onclick="removeImg('.$fetch['id'].');"/></td>';
					echo		'<input type="hidden" value="'.$fetch['opt'].'" name="option[]"/>';
					} else {
					echo		'<td><input type="text" name="option[]" value="'.$fetch['opt'].'"/></td>';
					}
					echo		'<input type="hidden" name="optionId[]" value="'.$fetch['id'].'"/>';
								$i++;
						}
					echo		'<td><input style="width:20px;" type="text" name="answer" value="'.$get['answer'].'"/></td>';
					echo		'<input type="hidden" name="questionId" value="'.$get['id'].'"/>';
					echo		'<td><input type="submit" value="Update"/></td>';
					echo		'<td><input type="button" value="Delete" onclick="deleteQuestion('.$get['id'].');"/></td>';
					echo	'</tr>';
					echo	'</form>';
					}
		?>
						</table>
						<form action="updateFormSettings.php" method="post" style="float:left;">
							<input type="hidden" name="add_new_question" value="true"/>
							<input type="submit" value="Add question"/>
						</form>
						<input type="button" value="Add image" onclick="addImage();"/>
					</div><!--.form-options-->
                </div><!--.content-box-content-->
                <div class="content-box-content">
                    
<?php
if(isset($success)) {
	if($success == 'success') {
		echo "<p>Your changes have been saved successfully!</p>";
	} elseif($success == 'formError') {
		echo "<p>There was an error updating form settings.</p>";
	} else {
		echo "<p>An error occurred. ".urldecode($_GET['s'])."</p>";
	}
}
?>

                </div>
                <!-- End .content-box-content -->
            </div>
            </div>
       
</body>
</html>
