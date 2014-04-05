<?php
session_start();
include('db.php');
$author = $_SESSION['user'];

?>
<div id="Records">
<?php  
$stat = mysql_query("SELECT status FROM concept_teachers WHERE name='$author'") or die(mysql_error());
while($lock = mysql_fetch_assoc($stat)) {
	$lockscreen = $lock['status'];
}
?>
<table class='records'>
	<th>Name</th><th>Character</th><th>Leadership</th><th>Comment</th><th>Context</th>
<?php
if($_SESSION['level'] < '2') {
	echo ($lockscreen == "1" ? "<div class='lock_screen'></div><!--end .lock_screen-->" : "");
$table = "concept_1_".$author;
$sql = mysql_query("
SELECT * 
FROM concept_students
LEFT JOIN $table 
ON concept_students.student_id = $table.target_student
ORDER BY concept_students.student ASC
") or die(mysql_error());
while($get = mysql_fetch_array($sql)) {
	echo "<tr class='editable edit_'>";
	echo "<td class='getname'>".$get['student']."</td>";
	echo "<td>".$get['ethics']."</td>";
	echo "<td>".$get['leadership']."</td>";
	echo "<td>".$get['comment']."</td>";
	echo "<td>".$get['context']."</td>";
	echo "<td class='record_id'><span class='hidden'>".$get['student_id']."</span></td>";
	echo "</tr>";
}//end while - begin master account records
} else {
$sql = mysql_query("
SELECT * FROM concept_students ORDER BY student ASC
");
while($get = mysql_fetch_array($sql)) {
$student_id = $get['student_id'];
$avg = mysql_query("SELECT AVG(ethics) AS average1, AVG(leadership) AS average2 FROM concept_average WHERE target_student='$student_id'");
	while($do = mysql_fetch_assoc($avg)) {
		$ethics_avg = $do['average1'];
		$leadership_avg = $do['average2'];
	}
	echo "<tr class='editable'>";
	echo "<td class='getname'>".$get['student']."</td>";
	echo "<td>".$ethics_avg."</td>";
	echo "<td>".$leadership_avg."</td>";
	echo "<td><span class='click_view_extra'>View</span></td>";
	echo "<td><span class='click_view_extra'>View</span></td>";
	echo "<td class='record_id'><span class='hidden'>".$get['student_id']."</span></td>";
	echo "</tr>";
}//end while
}//end if
?>
<tr></tr>
	</table>
</div><!--end #table-->

<div id="Students">
<form action="include/mass_delete.php" method="post" id="stu_del">
<table class='records'>
<?php if($_SESSION['level'] == '2') { ?>
	<th class="check_all_students">#</th>
<?php } ?>
	<th>Name</th>
<?php
$sql = mysql_query("SELECT * FROM concept_students ORDER BY student ASC") or die(mysql_error());
while($get = mysql_fetch_assoc($sql)) { ?>
	<tr class="editable">
	<?php if($_SESSION['level'] == '2') { ?>
		<td class="ch"><input type="checkbox" class="check" name="check[]" value="<?php echo $get['student_id']; ?>"/></td>
	<?php } ?>
		<td><?php echo $get['student']; ?></td>
		<td class='record_id'><span class="hidden"><?php echo $get['student_id']; ?></span></td>
	</tr>
<?php } ?>
<td></td>
</table>
</form>
</div><!--end #students-->

<div id="Teachers">
<form action="include/mass_delete.php" method="post" id="tea_del">
<table class='records'>
<?php if($_SESSION['level'] == '2') { ?>
	<th class="check_all_teachers">#</th>
<?php } ?>
	<th>Name</th><th><?php echo ($_SESSION['level'] == '2' ? "Password" : ""); ?></th><th><?php echo ($_SESSION['level'] == "2" ? "Status" : ""); ?></th>
<?php
$sql = mysql_query("SELECT * FROM `concept_teachers` WHERE name != 'master' ORDER BY name ASC");
while($get = mysql_fetch_array($sql)) { ?>
	<tr class="editable">
	<?php if($_SESSION['level'] == '2') { ?>
		<td class="ch"><input type="checkbox" class="check" name="check_tea[]" value="<?php echo $get['name']; ?>"/></td>
	<?php } ?>
		<td class="getname"><?php echo $get['name']; ?></td>
		<td><?php echo ($_SESSION['level'] == '2' ? $get['pass'] : ""); ?></td>
	<?php if($_SESSION['level'] == '2') { ?>
		<td><?php echo ($get['status'] == "1" ? "<span class='finished'>Finished</span> <span class='unlock hidden'>[unlock]</span>" : "In progress..."); ?></td>
	<?php } ?>	
		<td class='record_id'><span class="hidden"><?php echo $get['id']; ?></span></td>
	</tr>
<?php } ?>
<td></td>
</table>
</form>
</div><!--end #teachers-->

<div id="_lockdata">
	<div class="close"></div><!--end .close-->
	<p class="title">Lock results</p>
<?php
$session = $_SESSION['user'];
$sql = mysql_query("SELECT status FROM concept_teachers WHERE name='$session'");
while($get = mysql_fetch_assoc($sql)) {
	$status = $get['status'];
}
	if($status > 0) {
		echo "<p class='warn'>Your records are currently locked to prevent any further changes; ";
		echo "please contact an administrator if you wish to have your account unlocked.</p>";
	} else {
		echo "<p class='warn'>Locking your results in will cause your account to no longer be in editing mode. ";
		echo "Please make sure you have made all changes necessary to student records before proceeding.</p>";
	}
echo "<br />";
echo (($status > 0) ? "<input type='checkbox' disabled='disabled' checked='checked' id='_lock'/>" : "<input type='checkbox' id='_lock'/>"); ?>
<label for="_lock">Lock my results, and disable editing in my account.</label>
</div><!--end #_lockdata-->