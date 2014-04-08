<?php
include('../../config.php');

class Comment {
	public $postId,$name,$comment,$error;
	
	public function parseURL($url) {
		$explode = explode("&",$url);
		$name = explode("=",$explode[0]);
		$comment = explode("=",$explode[1]);
		$postId = explode("=",$explode[2]);
		$this->name = htmlentities(urldecode($name[1]),ENT_QUOTES);
		$this->comment = htmlentities(urldecode($comment[1]),ENT_QUOTES);
		$this->postId = $postId[1];
	}
	public function post() {
		$date = date('m/d/Y');
		$timestamp = time();
		if(mysql_query("INSERT INTO comments (author,comment,date,postId,timestamp) VALUES ('$this->name','$this->comment','$date','$this->postId','$timestamp')")) {
			return true;
		} else {
			$this->error = "An error occurred while updating the database. ".mysql_error();
			return false;
		}
	}
}

$comment = new Comment();
if(isset($_POST['data'])) {
	$comment->parseURL($_POST['data']);
	if($comment->post()) {
		echo "commentPostSuccess";
	} else {
		echo $comment->error;
	}
}
?>