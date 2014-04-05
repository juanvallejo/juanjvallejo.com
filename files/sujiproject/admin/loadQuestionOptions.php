<?php
include("db_config.php");
$id = $_POST['q_id'];

$optionSql = mysql_query("SELECT * FROM options WHERE q_id='$id'");
echo "<p class='title'>Select An Option</p>";
echo "<form action='updateFormSettings.php' method='post' name='optForm' id='optForm'>";
echo 	"<select name='chosen_option' id='optFormOption'>
			<option value='0'>Select an option</option>";
while($fetch = mysql_fetch_assoc($optionSql)) {
echo 		"<option value='".$fetch['id']."'>".$fetch['opt']."</option>";
}
echo 	"</select>";
echo '<input type="button" style="float:right;" id="saveImageChanges" value="Add image"/>';
?>