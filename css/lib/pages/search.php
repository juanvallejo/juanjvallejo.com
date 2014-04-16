<?php
$searchTerm = $_POST['searchTerm'];

echo '<div class="search">';
echo '<input type="text" id="searchBox" placeholder="Search tags or keywords..." class="input"/>';
echo '</div>';

if(isset($searchTerm)) {
	include('../config.php');
	$sql = mysql_query("SELECT * FROM posts WHERE title LIKE '%$searchTerm%' OR tags LIKE '%/$searchTerm/%' OR post LIKE '%$searchTerm%' ORDER BY date ASC");
	if(mysql_num_rows($sql) > 0) {
		include('../temps/post.php');
	} else {
		echo '<div class="post">';
		echo '<p class="center">No posts were found, try a different keyword, or check your spelling.</p>';
		echo '</div><!--.post-->';
	}
} else {
	echo '<div class="post">';
	echo '<p class="center">Enter a search term, a post title, or a tag name in the search box above.</p>';
	echo '</div><!--.post-->';
}
?>