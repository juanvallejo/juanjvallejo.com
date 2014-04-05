$(document).ready(function() {

	loadSavedFiles();

	$('#upload').click(function() {
		$('#choose_file').trigger('click');
	});
	$('#choose_file').live("change",function() {
		var file = $('#choose_file').val().toLowerCase().split("\\");
		var numFile = file.length;
		var ext = file[numFile-1].split(".");
		var arr = ["doc","docx","zip"];
		if($.inArray(ext[1],arr) == -1) {
			$('.ui-status span').html("File type not supported");
		} else {
			$('#form_file').submit();
		}
	});
});

function loadSavedFiles() {
	$('#content').load('css/data/saved_files.php',function(data) {
		if(data != "null") {
			$('#content').show();
		}
	});
}