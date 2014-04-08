$(document).live("ready", function() {
	var pageHeight = (($(document).height()) - 31);
	$('.container').css('min-height',pageHeight);
	
	$('.rectangle').live("click", function() {
		if($(this).hasClass('no-border')) {
			$(this).removeClass('no-border').css('border','1px solid #008AB8');
		} else {
			$(this).addClass('no-border').css('border','1px solid white');
		}
	});
	
	$('#menu li,.link').click(function() {
		var loc = $(this).attr('title');
		$('html,body').animate({scrollTop:$('#'+loc).offset().top},1000);
		$('#menu li').removeClass('menu-active');
		$(this).addClass('menu-active');
	});
	
	$('.download_file').click(function(e) {
		e.preventDefault();
		var version = $(this);
		$.ajax({type:'POST', url:'../../css/php/lib.php', data:{version:version.html()}, success:function(data) {
				if(data == "success") {
					window.location = version.attr('href');
				} else {
					$('#alert').slideDown('normal').children("p").html(data);
					$('html,body').animate({scrollTop:$('#alert').offset().top}, 1000);
				}
			}
		});
	});
/**
 * contact form
**/
	$('.contact_form_element').focus(function() {
		var obj = $(this);
		if(obj.val() == obj.attr('title')) {
			this.value = "";
		}

	});
	$('.contact_form_element').blur(function() {
		if(this.value == "") {
			this.value = this.title;
		}
	});
	$('#send_contact_form').click(function() {
		var name = document.getElementById("contact_name");
		var mail = document.getElementById("contact_email");
		var message = document.getElementById("contact_message");
		var alert = "contact_form_alert";
		if(name.value == name.title || name.value == "" || mail.value == "" || mail.value == mail.title || message.value == message.title || message.value == "") {
			createAlert(alert,"You seem to have missing fields.");
		} else if(mail.value.indexOf("@") == -1) {
			createAlert(alert,"Please enter a valid email address.");
		} else {
			$(this).fadeOut('normal', function() {
				$('#contact_wait').show();
			});
			$.ajax({type:'POST', url:'../../css/php/lib.php', data:{mail_name:name.value,mail_mail:mail.value,mail_message:message.value}, success:function(data) {
					if(data == "success") {
						createAlert(alert,"Thanks! I'll get back to you as soon as I can.",function() {
							$('#contact_wait').hide();
						});
					} else {
						createAlert(alert,data, function() {
							$('#contact_wait').hide();
						});
					}
				}, complete:function() {
					$('#send_contact_form').fadeIn('normal', function() {
						name.value = name.title;
						mail.value = mail.title;
						message.value = message.title;
					});
				}
			});
		}
	});
	
}); // end handlers

function createAlert(id,message,callback) {
	var elem = document.getElementById(id);
	$('#'+id).slideDown('normal', function() {
		if(typeof callback == "function") {
			callback.call();
		}
	});
	elem.innerHTML = message;
	
}