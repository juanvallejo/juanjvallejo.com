<?php
session_start();
include('include/db.php');
include('include/header.php');

if($_SESSION['user']) {
?>
<div class="window">
	<p class="title" id="a"></p>
	<div class="add">
	<ul>
<?php echo ($_SESSION['level'] < 2 ? '<li id="lock">lock</li>' : ''); ?>
		<li>
			view
			<div class="add_menu" id="view">
				<ul>
					<li class="view_all_records">Records</li>
					<li class="view_all_students">Students</li>
					<li class="view_all_teachers">Teachers</li>
				</ul>
			</div><!--end .add_menu-->
		</li>
	<?php if($_SESSION['level'] == '2') { ?>
		<li>
			new
			<div class="add_menu" id="new">
				<ul>
					<li class="add_new_student">Student</li>
					<li class="add_new_teacher">Teacher</li>
				</ul>
			</div><!--end .add_menu-->
		</li>
		<li id="delete_all">delete</li>
		<li>
			file
			<div class="add_menu" id="file">
				<ul>
					<li id="upload">Upload</li>
					<li id="print">Print</li>
				</ul>
			</div><!--end .add_menu-->
		</li>
	<?php } ?>
	</ul>
	</div><!--end .add-->
	<div id="append"></div><!--end #append-->
		<div class="pane" id="view_extra">
		</div><!--end .pane-->
</div><!--end .window-->
<?php
}
else {
?>
<div class="window">
	<div class="form_login" action="#">
		<form>
		<p class="tag">Username</p>
		<input type="text" id="user"/>
		<p class="tag">Password</p>
		<input type="password" id="pass"/>
		</form>
		<span id="alert"></span>
	</div><!--end .form_login-->
</div><!--end .window-->
<?php
}
include('include/footer.php');
?>