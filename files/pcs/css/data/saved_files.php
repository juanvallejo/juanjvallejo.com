<?php
$limit = 6;
$data = explode(",",$_COOKIE['saved_files']);
$count = count($data);
if($count <= $limit) {
	$count = $count;
} else {
	$count = $limit;
}
if(isset($_COOKIE['saved_files'])) {
	$glob = glob("zips/*.zip");
	checkExist($glob,$data);
	for($i=0;$i<$count;$i++) {
		echo "<div class='ui-item'>
			<div class='ui-item-icon'>
				<a href='css/data/zips/{$data[$i]}'><img src='css/i/zip.png' alt='zip'/></a>
			</div>
				<p style='width:100%; margin:17px 0 0 0; text-align:center; position:absolute; left:0;'><a class='ui' href='css/data/zips/{$data[$i]}'>{$data[$i]}</a></p>
			</div>";
	}
} else {
	echo "null";
}

function checkExist($arr1,$arr2) {
	$i=0;
	foreach($arr1 as $item) {
		$ex = explode("/",$item);
		$co = count($ex);
		$arr1[$i] = $ex[$co-1];
		$i++;
	}
	$i=0;
	foreach($arr2 as $item) {
		$ex = explode("/",$item);
		$co = count($ex);
		$arr2[$i] = $ex[$co-1];
		$i++;
	}
	$array = array_intersect($arr1,$arr2);
	$array = implode(",",$array);
	if(setcookie("saved_files",$array,time()+86400*360,"/")) {
		return;
	} else {
		die("<div class='ui-item'>Error updating user data</div>");
	}
}
?>
