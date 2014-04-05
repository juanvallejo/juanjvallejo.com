<?php
while($get = mysql_fetch_assoc($sql)) {
	$extra = explode(",",$get["extra"]);
	$inputClass = array();
	$textareaClass = array();
	$t = 0;
	$i = 0;
	for($x=0;$x<count($extra);$x++) {
		$explode = explode(":",$extra[$x]);
		if($explode[0] == "input") {
			$inputClass[$i] = $explode[1];
			$i++;
		} else {
			$textareaClass[$t] = $explode[1];
			$t++;
		}
	}
	echo 	'<div class="form">
				<div class="title">'.$get["title"].'</div><!--.title-->
				<p style="color:#a0a0a0;">'.$get["post"].'</p>
				<form id="form9" action="#mail.php">';
				for($i=0;$i<count($inputClass);$i++) { 
	echo			'<input type="text" placeholder="'.$inputClass[$i].'" name="'.$inputClass[$i].'" class="'.$inputClass[$i].' inputElement input"/>';
				}
				for($i=0;$i<count($textareaClass);$i++) {
	echo			'<textarea cols="38" rows="7" placeholder="'.$textareaClass[$i].'" name="'.$textareaClass[$i].'" class="'.$textareaClass[$i].' inputElement textarea"></textarea>';
				}
	echo			'<div class="button" id="contactButton">submit</div><!--.button-->
				</form>
				<div class="alert"></div><!--.alert-->
			</div><!--.form-->';
}
?>