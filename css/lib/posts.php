<?php
include('config.php');

$id = $_POST['id'];
$tag = $_POST['tag'];
$error = $_POST['pagenotfound'];
$page_id = $_POST['pageid'];
$use_template = $_POST['temp'];
$manual_template_override = ($use_template == "manual" ? true : false);

if(!isset($page_id)) {
	$page_id = 0;
}
if($manual_template_override) {
	$sql = mysql_query("SELECT page FROM pages WHERE id='$page_id'");
	while($get = mysql_fetch_assoc($sql)) {
		$pageName = $get['page'];
	}
} else {
	if(isset($id)) {
		$sql = mysql_query("SELECT * FROM posts WHERE id = '$id'");
	} elseif(isset($tag)) {
		$sql = mysql_query("SELECT * FROM posts WHERE tags LIKE '%/$tag%/'");
	} else {
		$sql = mysql_query("SELECT * FROM posts WHERE pageId='$page_id' ORDER BY systemDate DESC LIMIT 10");
	}
}
if(mysql_num_rows($sql) == 0 || isset($error)) {
	if(mysql_num_rows($sql) != 0) {
		echo '<p class="title">Error 404</p>';
		echo '<p class="tagline">Page not found</p>';
	} else {
		if($manual_template_override) {
			echo "<p class='tagline'>No content was found.</p>";
		} else {
			echo '<p class="tagline">No posts were found</p>';
		}
	}
} else { 
	if(isset($use_template)) {
		if($manual_template_override) {
			if(file_exists('pages/'.$pageName.'.php')) {
				include('pages/'.$pageName.'.php');
			} else {
				echo "<p class='title'>Error 404</p>";
				echo "<p class='tagline'>The requested file was not found on the server.</p>";
			}
		} else {
			include('temps/'.$use_template.'.php');
		}
	} else {
		include('temps/post.php');
	}
}
?>