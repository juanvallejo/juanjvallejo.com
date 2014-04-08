<?php
session_start();
include("../config.php");
include("../resources/functions/post.php");

if(isset($_SESSION['user'])) {
	if(isset($_POST['post_type'])) {
		$post = new Post($_POST['post_type']);
		if($post->push($_POST['post_title'],$_POST['post_content'],$_POST['post_tags'])) {
			echo "success";
		} else {
			echo $post->err;
		}
	} elseif(isset($_POST['post_id_delete'])) {
		$post = new Post();
		if($post->delete($_POST['post_id_delete'])) {
			echo "success";
		} else {
			echo $post->err;
		}
	} else {
		echo "//err: no data was received by the server";
	}
} else {
	echo "//err: You must be logged in to do that";
}
?>