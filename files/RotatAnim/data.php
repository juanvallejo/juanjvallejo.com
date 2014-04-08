<?php
class RotatAnim {
	public function sendMessage($subject,$body) {
		$r = false;
		if(mail("juuanv@gmail.com",$subject,$body)) $r = true;
		return $r;
	}
}
$app = new RotatAnim();
if($_POST['type'] == "message") {
	if($app->sendMessage($_POST['subject'],$_POST['body'])) echo "success";
	else die("Error 2");
} else die("Error 1");
?>