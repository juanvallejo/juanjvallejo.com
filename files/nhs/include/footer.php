	<div class="footer">Written by <a href="http://htcwebdesign.com/juanv" target="_blank">Juan Vallejo</a></div><!--end .footer-->
</div><!--end .wrapper-->
<div id="click_menu">
	<ul>
<?php if($_SESSION['level'] != '2') { ?>
		<li id="record_edit">edit</li>
		<li id="record_delete">clear</li>
<?php } else { 
			echo "<li id='view_item'>view</li>";
			echo "<li id='del_item'>delete</li>";
		} ?>
	</ul>
</div><!--end .click_menu-->
<div class="overlay"></div><!--end .overlay-->
</body>
</html>