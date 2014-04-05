$(document).live("ready", function() {
	appendData();
	$(document).live("contextmenu", function(e) {
			e.preventDefault();
	});
	$('.logo').click(function() {
		window.location = "../nhs";
	});
	$(document).click(function() {
		$('#click_menu').fadeOut('fast');
		$('.add_menu').fadeOut('fast');
	});
	$('#click_menu').click(function(e) {
		e.stopPropagation();
	});
	$('#click_menu li').click(function() {
		$('#click_menu').fadeOut('fast');
	});
	$('.records tr.editable').live("mousedown", function(e) {
		var id = $(this).children('td.record_id').children('span.hidden').html();
		$('span#record_selected_id').html(id);
		if(e.which === 3) {
			var view = $('#current_view').html();
			e.preventDefault();
			$('#click_menu').css({left: e.pageX, top: e.pageY});
			$('#click_menu').fadeIn('fast');
			$('.records tr').removeClass('active');
			$(this).addClass('active');
			if(view != "Records") {
				$('#record_edit').hide();
				$('#del_item').show();
				$('#record_delete').hide();
				$('#view_item').hide();
			}
			else {
				$('#record_edit').show();
				$('#del_item').hide();
				$('#record_delete').show();
				$('#view_item').show();
			}
		}
		else if(e.which === 1) {
			$('.records tr').removeClass('active');
			$(this).addClass('active');
		}
		$('.records tr:first-child').removeClass('active');
	});
	$('.form_login input').keydown(function(e) {
		if(e.keyCode == 13) {
			submitLoginForm();
		}
	});
	
	$('#record_delete').click(function() {
		var id = $('span#record_selected_id').html();
		var view = $('#current_view').html();
		$.ajax({type:'POST', url:'include/class.action.php', data:{del_id:id, curr_view:view}, success: function(data) {
				if(data == "deleted") {
					$('.records tr.active').fadeOut('slow', function() {
						showData(view);
					});
				}
				else {
					newAlert('Error', data);
				}
			}
		});
	});
	$('.edit_').live("click", function() {
		recordEdit();
	});
	$('#record_edit').click(function() {
		recordEdit();
	});
	$('.add_new_record').click(function() {
		var view = $('#current_view').html();
		$('#add_Record').html('Loading, please wait...');
		$('#add_Record').load('include/add_item.php');
	});
	$('.add_menu#new li').click(function() {
		var info = $(this).html();
		showDialogue('#add_'+info);
	});
	$('#add_record').live("click", function() {
		var rating = $('#add_rating').val();
		var rating2 = $('#add_rating2').val();
		var context = $('#add_context').val();
		var name = $('#add_name').val();
		var comment = $('#add_comment').val();
		if(rating == "" || name == "" || context == "" || rating2 == "") {
			$('.form_add p.alert').fadeIn('slow').html('You have missing fields').delay(3000).fadeOut('slow');
		}
		else {
			if(rating <= 2 || rating2 <= 2) {
				if($('span#check_comment').is(':hidden')) {
					$('span#check_comment').fadeIn('slow');
				}
				else {
					if(comment == "") {
						$('.form_add p.alert').fadeIn('slow').html('A comment is required').delay(3000).fadeOut('slow');
					}
					else {
						addRecord();
					}
				}
			}
			else {
				addRecord();
			}
		}
	});
	
	$('#edit_record').live("click", function() {
		var name = $('#edit_name').html();
		var rating = $('#edit_rating').val();
		var comment = $('#edit_comment').val();
		var id = $('#record_selected_id').html();
		var view = $('#current_view').html();
		var context = $('#edit_context').val();
		var rating2 = $('#edit_rating2').val();
		if(rating == "" || context == "") {
			$('.form_edit p.alert').fadeIn('slow').html('You have missing fields').delay(3000).fadeOut('slow');
		}
		else {
			if(rating <= '2' || rating2 <= '2') {
				if(comment == "") {
					$('.form_edit p.alert').fadeIn('slow').html('A comment is required').delay(3000).fadeOut('slow');
				}
				else {
					editRecord();
				}
			}
			else {
				editRecord();
			}
				
		}
	});
	
	$('#okay_add_student').click(function() {
		var name = $('#add_new_student').val();
		if(name == "") {
			$('#add_Student p.alert').fadeIn('slow').html('Please enter a name').delay(2000).fadeOut('slow');
		}
		else {
			addItem('student');
		}
	});
	
	$('#okay_add_teacher').click(function() {
		var name = $('#add_new_teacher').val();
		if(name == "") {
			$('#add_Teacher p.alert').fadeIn('slow').html('Please enter a name').delay(2000).fadeOut('slow');
		}
		else {
			addItem('teacher');
		}
	});
	
	$('.dialogue .close').live("click", function() {
		closeDialogue();
	});
	$('.pane .close').live("click", function() {
		$('.overlay').fadeOut('slow');
		$(this).parent('.pane').fadeOut('slow');
	});
	$('.add li').click(function(e) {
		e.stopPropagation();
		$('.add_menu').fadeOut('fast');
		if($(this).children().is(':visible')) {
			$(this).children().fadeOut('fast');
		} else {
			$(this).children().fadeIn('fast');
		}
	});
	
	$('.add_menu#view li').click(function() {
		var data = $(this).html();
		$('#current_view').html(data);
		showData(data);
	});
	$('.view_all_records').click(function() {
		appendData();
	});
	$('#del_item').click(function() {
		var id = $('#record_selected_id').html();
		var view = $('#current_view').html();
		$.ajax({type:'POST', url:'include/class.action.php', data:{del_item_id:id, view:view}, success: function(data) {
				if(data == "success") {
					$('.records tr.active').fadeOut('slow', function() {
						showData(view);
					});
				} else {
					newAlert("Warning", data);
				}
			}
		});
	});
	$('span.click_view_extra').live("click", function() {
		showPaneExtra();
	});
	$('#view_item').click(function() {
		showPaneExtra();
	});
	
	$('.records').live("click", function() {
		var count = $('td.ch input:checkbox:checked').length;
		if(count>=1) {
			$('#delete_all').fadeIn('slow');
		}
		else {
			$('#delete_all').fadeOut('slow');
		}
	});
	$('#delete_all').click(function() {
		var stuff = $(':checkbox:checked').val();
		var view = $("#current_view").html();
		if(view == "Students") {
			var str = $('#stu_del').serialize();
			$('input[type="checkbox"]:checked').parent().parent('tr.editable').fadeOut('slow', function() {
				$.ajax({type:'POST', url:'include/class.action.php', data:{student_mass_del:str}, success:function(data) {
						if(data == "success") {
							showData(view);
						} else {
							newAlert('Error', data);
						}
					}
				});
			});
		} else {
			var str = $('#tea_del').serialize();
			$('input[type="checkbox"]:checked').parent().parent('tr.editable').fadeOut('slow', function() {
				$.ajax({type:'POST', url:'include/class.action.php', data:{teacher_mass_del:str}, success:function(data) {
						if(data == "success") {
							showData(view);
						} else {
							newAlert('Error', data);
						}
					}
				});
			});
		}
		$('#delete_all').fadeOut('slow');
	});
	$('th.check_all_students').live("click", function() {
		if($('#Students input[type="checkbox"]').is(':checked')) {
			$('#Students input[type="checkbox"]').attr('checked', false);
		} else {
			$('#Students input[type="checkbox"]').attr('checked', true);
		}
	});
	$('th.check_all_teachers').live("click", function() {
		if($('#Teachers input[type="checkbox"]').is(':checked')) {
			$('#Teachers input[type="checkbox"]').attr('checked', false);
		} else {
			$('#Teachers input[type="checkbox"]').attr('checked', true);
		}
	});
	
	$('.add li#lock').click(function() {
		showDialogue('#lock_results');
		$('#lock_results').load('include/data.php #_lockdata');
	});
	$('#_lock').live("click", function() {
		var view = $('#current_view').html();
		if($(this).is(':checked')) {
			var id = "1";
		} else {
			var id = "unlock";
		}
		$.ajax({type:'POST', url:'include/class.action.php', data:{lock_id:id}, success:function(data) {
					if(data == "success") {
						closeDialogue('#lock_results');
						showData(view);
					} else {
						newAlert('Error', data);
					}
				}
			});
	});
	
	$('.records tr.editable').live("click", function() {
		var view = $('#current_view').html();
		var name = $(this).children('td.getname').html();
		$('#request').html(name);
		$('.records tr.editable span.unlock').hide();
		$('.records tr.editable span.finished').show();
		$(this).children().children('span.finished').fadeOut('slow', function() {
			$(this).parent().children('span.unlock').fadeIn('slow');
		});
	});
	$('#print').click(function() {
		var id = $('#record_selected_id').html();
		showDialogue('#print_results');
		$('#print_comments').click(function() {
			window.open('include/print.php?request=1');
		});
		$('#print_averages').click(function() {
			window.open('include/print.php?request=2');
		});
	});
	$('#upload').click(function() {
		window.location = "upload.php";
	});
	
	$('span.unlock').live("click", function() {
		var view = $('#current_view').html();
		var id = "unlock";
		var target = $('#request').html();
		$.ajax({type:'POST', url:'include/class.action.php', data:{lock_id:id, target:target}, success:function(data) {
				if(data=="success") {
					showData(view);
				} else {
					newAlert('Error', data);
				}
			}	
		});
	});
});

function submitLoginForm() {
	var user = $('#user').val();
	var pass = $('#pass').val();
	$('span#alert').fadeIn('slow').html('loading, please wait...').delay(3000).fadeOut('slow');
	if(user == "" || pass == "") {
		$('span#alert').html('You have missing fields');
	}
	else {
		$.ajax({type:'POST', url:'include/class.login.php', data:{user:user, pass:pass}, success: function(data) {
			if(data == "success") {
				window.location.reload();
			}
			else {
				$('span#alert').html(data);
			}
		}
		});
	}
}
function appendData() {
	$('p.title#a').html('Records');
	$('#append').load('include/data.php #Records');
}
function showData(info) {
	$('p.title#a').html(info);
	$('#append').load('include/data.php #'+info);
}
function showDialogue(objectId) {
	$('.overlay').fadeIn('fast', function() {
		$(objectId).slideDown('slow');
	});
}
function closeDialogue() {
	$('.dialogue').slideUp('slow', function() {
		$('.overlay').fadeOut('fast');
	});
	$('.dialogue input').val('');
	$('.dialogue textarea').val('');
}
function addRecord() {
	var rating = $('#add_rating').val();
	var rating2 = $('#add_rating2').val();
	var name = $('#add_name').val();
	var comment = $('#add_comment').val();
	var context = $('#add_context').val();
	var view = $('#current_view').html();
	$.ajax({type:'POST', url:'include/class.action.php', data:{add_rating:rating, add_name:name, add_comment:comment, add_context:context, add_rating2:rating2}, success: function(data) {
			if(data == "added") {
				$('#add_rating').val('');
				$('#add_name').val('');
				$('#add_comment').val('');
				$('#add_rating2').val('');
				$('#add_context').val('');
				$('.form_add p.alert').fadeIn('slow').html('The data has been added').delay(3000).fadeOut('slow');
				showData(view);
			}
			else {
				$('.form_add p.alert').fadeIn('slow').html(data).delay(3000).fadeOut('slow');
			}
		}
	});
}
function editRecord() {
	var name = $('#edit_name').html();
	var rating = $('#edit_rating').val();
	var rating2 = $('#edit_rating2').val();
	var context = $('#edit_context').val();
	var comment = $('#edit_comment').val();
	var id = $('#record_selected_id').html();
	
	$.ajax({type:'POST', url:'include/class.action.php', data:{edit_name:name, edit_rating:rating, edit_comment:comment, edit_id:id, edit_rating2:rating2, edit_context:context}, success: function(data) {
			if(data == "changed") {
				appendData();
				closeDialogue();
			}
			else {
				$('.form_edit p.alert').fadeIn('slow').html(data).delay(3000).fadeOut('slow');
			}
		}
	});
}
function newAlert(title, message) {
	$('.alert_box').slideDown('slow', function() {
		$('.alert_box p.title').html(title);
		$('.alert_box p.message').html(message);
		$(this).click(function() {
			$(this).slideUp('slow');
		});
	});
}
function addItem(target) {
	var name = $('#add_new_'+target).val();
	var view = $('#current_view').html();
	var pass = $('#add_new_pass').val();
	$.ajax({type:'POST', url:'include/class.action.php', data:{add_item:name, target:target, pass:pass}, success:function(data) {
			if(data == "added") {
				$('p.alert').fadeIn('slow').html('Data added').delay(2000).fadeOut('slow', function() {
					$('p.alert').html('');
				});
				$('#add_new_'+target).val('');
				$('#add_new_pass').val('');
				showData(view);
			}
			else {
				$('p.alert').fadeIn('slow').html(data).delay(2000).fadeOut('slow').html('');
			}
		}
	});
}
function showPaneExtra() {
	var id = $('#record_selected_id').html();
		$('.overlay').fadeIn('slow');
		$('.pane#view_extra').fadeIn('slow', function() {
			$.ajax({type:'POST', url:'include/view.php', data:{targ_stu:id}, success: function(data) {
					$('.pane#view_extra').html(data);
				}
			});
		});
}
function recordEdit() {
	showDialogue('#edit_item');
	var id = $('#record_selected_id').html();
	var view = $('#current_view').html();
	$.ajax({type:'POST', url:'include/edit_item.php', data:{id:id, view:view}, success: function(data) {
			$('#edit_item').html(data);
		}
	});
}