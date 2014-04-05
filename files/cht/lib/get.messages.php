<?php
session_start();
include("config.php");

$time = intval(time()-300);
$sq = mysql_query("UPDATE guests SET status='2' WHERE time < '$time'");
$time2 = intval(time()-600);
$sq = mysql_query("DELETE FROM guests WHERE time < '$time2'");

if($_SESSION['user'] && $_COOKIE['session']) {
	$dbId = "-".$_SESSION['id']."-,";
	$sql = mysql_query("SELECT * FROM chat WHERE recipients='' OR recipients LIKE '%$dbId%' ORDER BY id DESC");
	echo "<div id='currentMessageCount' class='hidden'>".mysql_num_rows($sql)."</div>";
	while($get = mysql_fetch_assoc($sql)) {
		$message = $get['message'];
		if(preg_match("/^((http|https):\/\/)([w]*)\.(youtube.com)/i",$message)) {
			$title = explode("[",$message);
			$link = preg_replace("/\ $/","",$title[0]);
			if($title[1] != "") {
				$linkTitle = preg_replace("/[\]\[]/","",$title[1]);
			} else {
				$linkTitle = "untitled link";
			}
			$linkType = "poetry";
			$message = "<span class='link_identifier'>[".$linkType."]</span> <span class='posted-link' title='".$link."'>".$linkTitle."</span>";
		} elseif(preg_match("/^(http:\/\/)([a-z0-9\-\_\.]+[a-z0-9\-\_\.]*)\.(com|net|org|co|im|me)/i",$message)) {
			$title = explode("[",$message);
			$link = preg_replace("/\ $/","",$title[0]);
			if($title[1] != "") {
				$linkTitle = preg_replace("/[\]\[]/","",$title[1]);
			} else {
				$linkTitle = "untitled link";
			}
			if(isImage($link)) {
				$linkType = "image";
			} else {
				$linkType = "link";
			}
			$message = "<span class='link_identifier'>[".$linkType."]</span> <span class='posted-link' title='".$link."'>".$linkTitle."</span>";
		} elseif(preg_match("/&lt;([a-z]+)([a-z0-9=\s]+&quot;[^\n]+&quot;)*(\/)*&gt;/i",$message)) {
			if(preg_match("/&lt;([a-z]+)([a-z0-9=\s]+&quot;[a-z0-9\#\:\.\/\-\_\+\=\?&\;\@\%\!\~]+&quot;)*&gt;([^\n]+)&lt;\/([a-z]+)&gt;/i",$message)) {
					$message = html_entity_decode($message,ENT_QUOTES);
					if(preg_match("/<a href=/i",$message)) {
						$link = preg_replace("/(<a href=\")([^\n]+)(\">)([^\n]*)/i","$2",$message);
						if(isImage($link)) {
							$linkType = "image";
						} else {
							$linkType = "link";
						}
						$message = preg_replace("/<a href/i","<span class='posted-link' title",$message);
						$message = preg_replace("/<\/a>/","</span>",$message);
						$message = "<span class='link_identifier'>[".$linkType."]</span> ".$message;
					}
			} elseif(preg_match("/&lt;(img)([a-z0-9=\s]+&quot;[a-z0-9\#\:\.\/\-\_\+\=\?&\;\@\%\!]+&quot;)+([a-z0-9=\s]+&quot;[^\n]+&quot;)*(\/)*&gt;/i",$message)) {
				$message = html_entity_decode($message);
				$link = preg_replace("/(<img src=\")([^\n]+)(\")(\/)*(>)/i","$2",$message);
				if(preg_match("/alt=\"/",$message)) {
					$message = preg_replace("/(\ alt=\")([^\n]+)(\")/i","$2",$message);
				} else {
					$message = "untitled link";
				}
				$message = "[work in progress...] ".$message." (".$link.")";
			} else {
				$message = "<span class='html_error'>[html error]</span> ".$message;
			}	
		}
		$time = intval((time()-$get['time']));
		if($time <= 60) {
			$when = $time." seconds";
		} elseif($time > 60) {
			if($time > 3600) {
				if($time > 86400) {
					$when = intval($time / 60 / 60 / 24)." days";
				} else {
					$when = intval($time / 60 / 60)." hours";
				}
			} else {
				$when = intval($time / 60)." minutes";
			}
		}
		echo "<div class='item'>
				".$message." <span class='grey1 heading0'>".$when." ago</span>
				<span class='hidden' id='selectedPostId'>{$get['id']}</span>
				<div class='right grey1'>{$get['author']}</div><!--.itemright-->
			</div><!--.item-->";
	}

	if(mysql_num_rows($sql) == 0) {
		echo "<div class='item'>There are no messages to display.</div><!--.item-->";
	}
} elseif(!$_COOKIE['session'] && $_SESSION['user']) {
	if($_SESSION['user']) {
		$id = $_SESSION['id'];
		if(mysql_query("DELETE FROM guests WHERE id='$id'")) {
			session_destroy();
		}
	}
} else {
	echo "You have been logged out! Please reload the page.";
	echo "<div id='checkSessionStatus' class='hidden'>12</div>";
}

function isImage($param) {
	if(preg_match("/\.(jpeg|jpg|png|gif)$/",$param)) {
		return true;
	} else {
		return false;
	}
}
?>