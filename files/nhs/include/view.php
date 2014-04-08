<?php
session_start();
include('db.php');
$target = $_POST['targ_stu'];
$getname = mysql_query("SELECT student FROM concept_students WHERE student_id = '$target'");
echo "<div class='close'></div><!--end .close-->";
	while($name = mysql_fetch_assoc($getname)) {
		echo "<p class='title'>".$name['student']."</p>";
	}
$sql = mysql_query("SELECT author, comment, context FROM concept_average WHERE target_student='$target'");
?>
<table class="records">
<th>Teacher</th><th>Comment</th><th>Context</th>
<?php
while($get = mysql_fetch_array($sql)) {
	echo "<tr>";
	echo "<td>".$get['author']."</td>";
	echo "<td>".$get['comment']."</td>";
	echo "<td>".$get['context']."</td>";
	echo "</tr>";
}
?>
	<tr></tr>
</table>