<?php
include('../config.php');
$searchTerm = $_POST['searchTerm'];
?>
<div class="search">
	<input type="text" id="searchBox" placeholder="Search tags or keywords..." class="input"/> 
</div>
<?php
if(isset($searchTerm)) {
	$sql = mysql_query("SELECT * FROM posts WHERE title LIKE '%$searchTerm%' OR tags LIKE '%/$searchTerm/%' OR post LIKE '%$searchTerm%' ORDER BY date ASC");
	if(mysql_num_rows($sql) > 0) {
		include('../temps/post.php');
	} else {
		echo '<div class="post">';
		echo 'No posts were found, try a different keyword, or check your spelling.';
		echo '</div><!--.post-->';
	}
} else {
	echo '<div class="post">';
	echo 'Enter a search term, a post title, or a tag name in the search box above.';
	echo '</div><!--.post-->';
}
?>