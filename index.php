<?php
session_start();
include('css/lib/config.php');
?>
<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="UTF-8"/>
<title>Juan Vallejo - Web Developer</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="css/settings.js"></script>
<link rel="stylesheet" href="css/reset.css"/>
<link rel="stylesheet" href="css/styles.css"/>
</head>
<body>
<div id="overlay">
	<div id="box_post" class="box">
		<input type="text" placeholder="Post title..." class="box_input" id="post_title"/>
		<textarea placeholder="Post content, shift+enter to submit..." class="box_input" id="post_content"></textarea>
		<input type="text" placeholder="Enter tags, sepatated by commas..." class="box_input" id="post_tags" style="width:60%"/>
		<span id="post_image"><input type="file" id="post_image_input"/><span>Upload an image</span></span>
	</div><!--#box_post-->
</div><!--#overlay-->
<div id="login"></div><!--#login-->
<div id="wrapper">
	<div id="header">
	<?php
		$host = explode(":",$_SERVER['HTTP_HOST']);
		
		echo '<div id="name"><a href="'.($host[0] == "localhost" ? "/" : "http://juanv.us/#!/home").'">Juan Vallejo</a></div><!--#name-->';
		echo '<div id="nav">';
		echo	'<ul>';

			$sql = mysql_query("SELECT * FROM pages");
			while($get = mysql_fetch_assoc($sql)) {
				$location = '#!/page/'.$get['id'].'/'.$get['kind'].'/'.$get['page'];
				$target = "";
				if(isset($get['location'])) {
					if($get['href'] == 2) {
						$location = $get['location'];
						$target = 'target="_blank"';
					}
				}
				echo '<li class="menuItem"><a '.$target.' href="'.$location.'" class="underline">'.$get["page"].'</a></li>';
			}
			?>
			</ul>
		</div><!--#nav-->
	</div><!--#header-->
	<div id="container">
	<?php
	$sql = mysql_query("SELECT * FROM posts WHERE pageId='0' ORDER BY id DESC LIMIT 20");
	include('css/lib/temps/post.php');
	?>
	</div><!--#container-->
	<div id="footer">Made by Juan Vallejo</div><!--#footer-->
</div><!--#wrapper-->
</body>
</head>
</html>