<?php
session_start();
	$customStyling = $_POST['customStyling'];
	if(empty($customStyling)) {
		$styling = "style='max-height:108px;overflow-y:hidden;'";
	} else {
		$styling = stripslashes($customStyling);
	}
	while($get = mysql_fetch_assoc($sql)) {
		$postId = $get['id'];
		$titleUrl = strtolower(preg_replace("/[\ ]/","+",$get['title']));
		$titleUrl = preg_replace("/[\'\.:#\"\/]/","",$titleUrl);
		$tagConfig = preg_replace("/[\/\ ]/","",$get['tags']);
		$tagUrl = explode(",",$tagConfig);
		$tags = explode(",",$tagConfig);
		$image = $get['img'];
		$i=0;
		$sql2 = mysql_query("SELECT id FROM comments WHERE postId='$postId'");
		foreach($tags as $tag) {
			$tags[$i] = "#".$tag;
			$i++;
		}
		$countTags = count($tags);
		echo '
			<div class="post">
				<div class="left">
					<ul>
						<li>'.$get["date"].'</li>
						<li>'.mysql_num_rows($sql2).' comments</li>
						<li style="margin-bottom:10px;"></li>';
						for($i=0;$i<$countTags;$i++) {
							echo '<li><a class="underline-dotted" href="#!/tag/'.$tagUrl[$i].'">'.$tags[$i].'</a></li>';
						}
		echo		'</ul>
				</div><!--.left-->
				<div class="right">';
				if(isset($customStyling) && $image != "") {
					echo '<div class="image"><img src="'.$image.'" alt="'.$get["title"].'"/></div><!--.image-->';
				}
				if($_SESSION['user']) {
					echo "<div id='".$get["id"]."' class='post_delete'>delete</div><!--.post_delete-->";
				}
		echo		'<div class="title"><a class="underline" href="#!/post/'.$get["id"].'/'.$titleUrl.'">'.$get["title"].'</a></div><!--.title-->
					<div class="content" '.$styling.'>'.$get["post"].'</div><!--.content-->';
				if(isset($customStyling)) {
		echo		'<div class="post-comment form">
						<p class="title" style="margin-bottom:0;">Leave a comment</p>
						<form id="post-comment" action="#comments.php" style="float:left;">
							<input type="text" class="input inputElement" name="name" placeholder="Name"/>
							<textarea cols="38" rows="3" class="textarea inputElement" name="comment" placeholder="Comment here..."></textarea>
							<input type="hidden" name="postId" value="'.$postId.'"/>
							<div class="button" id="submitComment">submit</div><!--.button-->
						</form>
						<div class="alert"></div><!--.alert-->
					</div><!--.post-comment-->
					<div class="comments">';
					$sqlComments = mysql_query("SELECT * FROM comments WHERE postId='$postId' ORDER BY timestamp DESC");
					if(mysql_num_rows($sqlComments) > 0) {	
		echo			'<p class="title">View comments</p>';			
						while($fetch = mysql_fetch_assoc($sqlComments)) {
		echo				'<div class="comment-item">
								<span style="float:left;clear:both;display:block;color:#222;">'.$fetch["comment"].'</span>
								<span style="float:left;clear:left;color:#797979;">'.$fetch["author"].'</span>
								<span style="float:right;color:#797979;font-size:0.8em;">'.$fetch["date"].'</span>
							</div><!--.comment-item-->';
						}
					}
		echo		'</div><!--.comments-->';
				}
		echo	'</div><!--.right-->
			</div><!--.post-->';

	} // end loop
?>