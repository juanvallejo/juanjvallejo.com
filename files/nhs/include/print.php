<?php
session_start();
include('db.php');
$request = $_GET['request'];
?>
<!DOCTYPE html>
<html lang="en-us">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="description" content="Douglas S. Freeman NHS Database"/>
<meta name="keywords" content="concept"/>
<meta name="Author" content="Juan Vallejo (juuanv@gmail.com)"/>
	<title>Print All Records</title>
<script type="text/javascript" src="css/jquery.min.js"></script>
<script type="text/javascript" src="css/settings.js"></script>
<link rel="stylesheet" type="text/css" href="../css/reset.css"/>
<link rel="stylesheet" type="text/css" href="../css/settings.css"/>
<style type="text/css">
	body {
		font:normal 14px 'sansation'; color:#515050; padding:10px 0 0 10px;
	}
	.records {
			width:100%; border:0px solid #777777; float:left; margin:15px 0;
		}
		.records tr {
			height:23px;
		}
			.records td {
				width:20px; border-bottom:1px dashed #ccc; height:20px; border-right:1px dashed #ccc;
			}
	.records th {
			font-size:17px; height:25px;
		}
			th[class^="check_all_"]:hover {
				cursor:pointer; color:#1598af;
			}
		.records td {
			padding:4px;
		}
	p {
		width:100%; float:left; font:inherit;
	}
	p.title {
		font-size:22px;
	}
	p.tag {
		font-size:18px;
	}
	p.warn {
		font-size:12px; text-align:center; margin:0 0 9px 0;
	}
a {
color:inherit; text-decoration:none;
}
	a:hover {
		text-decoration:underline;
	}
</style>
</head>
<body>
<?php
echo "<p class='title'>Student Records</p>";
echo "<table class='records'>";
	if($request == "1") {
echo "<th>name</th><th>comments</th><th>context</th>";
$sql = mysql_query("SELECT student_id,student FROM concept_students") or die(mysql_error());
while($fetch = mysql_fetch_assoc($sql)) {
	$stu_id = $fetch['student_id'];
		echo "<tr>";
		echo "<td>".$fetch['student']."</td>";
		$sql2 = mysql_query("SELECT comment,context FROM concept_average WHERE target_student = '$stu_id'") or die(mysql_error());
		while($fetch = mysql_fetch_assoc($sql2)) {
		echo "<tr><td></td><td>".$fetch['comment']."</td><td>".$fetch['context']."</td></tr>";
		}
		echo "</tr>";
}
	} else {//end if
echo "<th>Name</th><th>Character</th><th>Leadership</th>";
$sql2 = mysql_query("SELECT * FROM concept_students");
while($fetch = mysql_fetch_array($sql2)) {
	$student_id = $fetch['student_id'];
	echo "<tr>";
	echo "<td>".$fetch['student']."</td>";
	$sql = mysql_query("SELECT AVG(ethics) AS ethics, AVG(leadership) AS leadership FROM concept_average WHERE target_student = '$student_id'");
	while($fetch = mysql_fetch_assoc($sql)) {
		echo "<td>".$fetch['ethics']."</td>";
		echo "<td>".$fetch['leadership']."</td>";
	}
		echo "</tr>";
}
$avg = mysql_query("SELECT AVG(ethics) AS average1, AVG(leadership) AS average2 FROM concept_average WHERE target_student='$id'") or die(mysql_error());
while($do = mysql_fetch_assoc($avg)) {
	$ethics = $do['average1'];
	$leadership = $do['average2'];
}
echo "<tr></tr>";
echo "<tr>";
echo "<td>".$ethics."</td>";
echo "<td>".$leadership."</td>";
echo "</tr>";
	}
echo "</table>";
?>
</body>
</html>