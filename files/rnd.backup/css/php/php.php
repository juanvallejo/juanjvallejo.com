<?php
if(isset($_POST['submit'])) {
	$post = htmlentities($_POST['text'], ENT_QUOTES);
	echo $post;
} else {
	echo ":(";
}
?>
<form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
	<textarea cols="20" rows="7" name="text"></textarea><br />
	<input type="submit" name="submit" value="convert"/>
</form>