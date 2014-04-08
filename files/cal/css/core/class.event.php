<?php
include('db.php');

class Event {
	public $error;
	
	public function post($title,$date) {
		if(mysql_query("INSERT INTO events(name,date) VALUES ('$title','$date')"))
			return true;
		else
			$this->error = mysql_error(); 
			return false;
	}
	public function modify($title,$date,$id) {
		if(mysql_query("UPDATE events SET name='$title',date='$date' WHERE id='$id'"))
		return true;
			else
				$this->error = mysql_error();
				return false;
	}
	public function delete($id) {
		if(mysql_query("DELETE FROM events WHERE id='$id'")) return true;
			else 
				$this->error = mysql_error();
				return false;
	}
}

$id = $_POST['id'];
if($id == 'id1') {
	$event = new Event;
	if($event->post(htmlentities($_POST['title'],ENT_QUOTES),htmlentities($_POST['date'],ENT_QUOTES))) echo "success";
	else echo $event->error;
} elseif($id == 'id2') {
	$event = new Event;
	if($event->modify(htmlentities($_POST['title'],ENT_QUOTES),htmlentities($_POST['date'],ENT_QUOTES),$_POST['eventId'])) echo "success";
		else echo $event->error;
} elseif($id == 'id3') {
	$event = new Event;
	if($event->delete($_POST['eventId'])) echo "success";
		else echo $event->error;
}
?>