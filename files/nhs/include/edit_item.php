<?php
session_start();
include('db.php');
$id = $_POST['id'];
$table = "concept_1_".$_SESSION['user'];
$sql = mysql_query("
SELECT * 
FROM concept_students LEFT JOIN $table
ON concept_students.student_id = $table.target_student
WHERE $table.target_student='$id'") or die(mysql_error());
while($get = mysql_fetch_assoc($sql)) {
	$name = $get['student'];
	$rating = $get['ethics'];
	$rating2 = $get['leadership'];
	$context = $get['context'];
	$comment = $get['comment'];
}
?>
<div class="close"></div><!--end .close-->
<p class="title">Edit record</p>
	<div class="form_edit">
	<form action="#" id="edit_existing">
		<p class="tag" id="edit_name"><?php echo $name; ?></p>
		<p class="tag">Character</p>
		<select id="edit_rating">
			<option value="<?php echo $rating; ?>"><?php echo $rating; ?></option>
			<?php for($i=1;$i<=5;$i++) {echo "<option value='".$i."'>".$i."</option>";} ?>
		</select>
		<p class="tag">Leadership</p>
		<select id="edit_rating2">
			<option value="<?php echo $rating2; ?>"><?php echo $rating2; ?></option>
			<?php for($i=1;$i<=5;$i++) {echo "<option value='".$i."'>".$i."</option>";} ?>
		</select>
		<p class="tag">Context</p>
		<input type="text" id="edit_context" value="<?php echo $context; ?>"/>
		<span id="toggle_comments">
		<p class="tag">Comment</p>
		<textarea cols="21" rows="8" id="edit_comment"><?php echo $comment; ?></textarea>
		</span>
		<div class="okay" id="edit_record"></div><!--end .okay-->
	</form>
		<p class="alert"></p>
	</div><!--end .form_edit-->