<?php
while($get = mysql_fetch_assoc($sql)) {
	echo '<div class="item">
			<div class="img" style="background-image:url('.$get['img'].');"><a href="'.$get['url'].'"></a></div><!--.img-->
			<div class="body">
				<div class="title"><a href="'.$get['url'].'">'.$get['title'].'</a></div><!--.title-->
				<div class="content">
					'.$get['post'].'
				</div><!--.content-->
			</div><!--.body-->
		</div><!--.item-->';
} //end loop
?>