<?php
include('../../config.php');

class Message {
	public $mail = "juuanv@gmail.com",$name,$sender,$message,$error,$email,$data;
	public $subject = "Message from juanjvallejo.com";
	
	public function __construct($data) {
		$this->data = $data;
	}
	public function check() {
		if(isset($this->data)) {
			return true;
		} else {
			$this->error = "You have missing fields.";
			return false;
		}
	}
	public function construct() {
		$i=0;
		$data = explode("&",$this->data);
		foreach($data as $arr) {
			$item = explode("=",$arr);
			$data[$i] = $item[1];
			$i++;
		}
		$this->name = urldecode($data[0]);
		$this->sender = urldecode($data[1]);
		$this->message = urldecode($data[2]);
		$this->parseMessage();
	}
	public function parseMessage() {
		$this->email = "From: ".$this->name." (".$this->sender.")\n";
		$this->email .= $this->message;
	}
	public function push() {
		if(preg_match("/^[a-z0-9_\-\.\&]+@[a-z0-9\-\_]+\.[a-z]{2,5}/i",$this->sender)) {
			if(mail($this->mail,$this->subject,$this->email)) {
				return true;
			} else {
				$this->error = "There was an error sending your message.";
				return false;
			}
		} else {
			$this->error = "Please enter a valid email.";
		}
	}
}

$message = new Message($_POST['data']);
if($message->check()) {
	$message->construct();
	if($message->push()) {
		echo "success";
	} else {
		echo $message->error;
	}
} else {
	echo $message->error;
}
?>