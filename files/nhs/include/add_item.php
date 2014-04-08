<?php session_start(); include('db.php'); ?>
<div class="close"></div><!--end .close-->
	<p class="title">Add record</p>
	<div class="form_add">
	<form action="#" id="add_new">
		<p class="tag">Name</p>
		<select id="add_name">
			<option value="">Student name</option><?php
	$sql = mysql_query("SELECT name FROM `concept_students`");
while($get = mysql_fetch_array($sql)) { echo "<option value='".$get['name']."'>".$get['name']."</option>"; }
			?></select>
		<p class="tag">Ethics</p>
		<select id="add_rating">
			<option value="">Ethics rating</option>
			<?php for($i=1;$i<5;$i++) {echo "<option value='".$i."'>".$i."</option>";} ?>
		</select>
		<p class="tag">Leadership</p>
		<select id="add_rating2">
			<option value="">Leadership rating</option>
			<?php for($i=1;$i<5;$i++) {echo "<option value='".$i."'>".$i."</option>";} ?>
		</select>
		<p class="tag">Context</p>
		<input type="text" id="add_context"/>
		<span id="check_comment">
		<p class="tag">Comment</p>
		<textarea cols="21" rows="8" id="add_comment"></textarea>
		</span>
		<div class="okay" id="add_record"></div><!--end .okay-->
	</form>
		<p class="alert"></p>
	</div><!--end .form_add-->