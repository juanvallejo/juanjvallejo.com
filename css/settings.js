$(document).ready(function() {
	var hash = new Hash();
	hash.listen();
	
	$(window).bind("hashchange",function() {
		hash.listen();
	});
	$('.item .body').live("mouseenter",function() {
		$(this).parent(".item").animate({scrollTop:$(this).children(".content").offset().top},{duration:350,queue:false});
	});
	$('.item .body').live("mouseleave",function() {
		$(this).parent(".item").animate({scrollTop:0},{duration:350,queue:false});
	});
	$('.form .button').live("click",function() {
		var form = $(this).parent("form");
		var numOfInputs = form.children('.inputElement');
		var numOfReadyInputs = 0;
		var getFormAction = form.attr('action');
		var data = form.serialize();
		var push = new Load("css/lib/resources/functions/"+getFormAction.split("#")[1]);
		numOfInputs.each(function() {
			if($(this).val() != "") {
				numOfReadyInputs++;	
			}
		});
		if(numOfInputs.length == numOfReadyInputs) {		
			push.message({data:data});
		} else {
			$(this).parent().parent('.form').children('.alert').html("You have missing fields.").fadeIn('normal').delay(5000).fadeOut('normal');
		}
	});
	$('.content a').live("click",function() {
		window.open($(this).attr('href'));
		return false;
	});
	$('#searchBox').live("keydown",function(e) {
		if(e.keyCode == 13) {
			var searchTerm = $(this).val();
			if(searchTerm == "") {
				alert("Please enter a keyword to search for.");
			} else {
				var load = new Load("css/lib/pages/search.php");
				load.content({searchTerm:searchTerm});
			}
		}
	});
	$('#loginform').live('keydown',function(e) {
		if(e.keyCode == 13) {
			var user = $(this).children("#username").val();
			var pass = $(this).children("#password").val();
			var response = $(this).siblings(".response");
			if(user == "" || pass == "") {
				response.html("Please enter a username and a password.");
			} else {
				$.ajax({type:'POST',url:"css/lib/pages/admin.php",data:{username:user,password:pass},success:function(data) {
						if(data == "success") {
							var load = new Load("css/lib/pages/admin.php");
							load.target = $("#login");
							load.content();
						} else {
							response.html(data);
						}
					}
				});
			}
		}
	});
	$('.post_delete').live('click',function() {
		var id = $(this).attr('id');
		var post = new Post();
		post.delete(id);
	});
	$('#post_image').live("click",function() {
		document.getElementById("post_image_input").click();
	});
		$('#post_image_input').change(function() {
			var v = $(this).val().split("\\");
			v = v[v.length-1];
			$('#post_image').children("span").html(v);
		});
	$('#terminal').live('keydown',function(e) {
		if(e.keyCode == 13) {
			var v,t = document.getElementById("terminal");
			if(t.value.match(/^\//gi)) {
				var c = t.value.split("/")[1].split(" ");
				if(c[0] == "close" || c[0] == "logout" || c[0] == "bye") {
					var terminal = new Terminal();
					terminal.close();
				} else if(c[0] == "create" || c[0] == "make" || c[0] == "new") {
					if(c[1] == "post") {
						if(c[0] == "new" && !c[2]) {
							c[2] = "blog";
						}
						if(c[2]) {
							var post = new Post();
							post.create(c[2]);
							v = post.out;
						} else {
							v = "//err: post type not defined";
						}
					}
				}
				t.value = v || "";	
			}
		}
	});
	
function Load(url) {
	this.url = url;
	this.speed = 200;
	this.target = $('#container');
	this.content = function(data) {
		var data = data || {};
		var target = this.target;
		var speed = this.speed;
		target.hide();
		$.ajax({type:'POST',url:this.url,data:data,success:function(data) {
				try {
					data = JSON.parse(data);
					if(data.relocate) {
						window.location.assign("#!/home");
						window.location = data.location;
					} else {
						target.html(data.content);
					}
				} catch(e) {
					target.html(data);
				}
			},complete:function() {
				target.fadeIn(speed);
			}
		});
	}
	this.message = function(data) {
		$.ajax({type:'POST',url:this.url,data:data,success:function(data) {
				if(data == "success") {
					$('.alert').html("Thank you, your message has been sent.").fadeIn('normal').delay(5000).fadeOut('normal');
					$('.inputElement').val('');
				} else if(data == "commentPostSuccess") {
					$('.alert').html("Thank you, your comment has been posted.").fadeIn('normal').delay(5000).fadeOut('normal');
					$('.inputElement').val('');
					var hash = new Hash();
					hash.listen();
				} else {
					$('.alert').html(data).fadeIn('normal').delay(5000).fadeOut('normal');
				}
			}
		});
	}
}
function Post() {
	var terminal = new Terminal();
	var load = new Load("css/lib/posts.php");
	var Post = this;
	this.out = "";
	this.type = undefined;
	this.create = function(a) {
		if(a == "blog" || a == "entry" || a == "new") {
			this.type = a;
			$('#overlay').fadeIn('normal',function(e) {
				$('#box_post').fadeIn('normal');
				$('#post_title').focus();
				$('#box_post').live('keydown',function(e) {
					if(e.keyCode == 27) {
						Post.close();
					} else if(e.shiftKey) {
						if(e.keyCode == 13) {
							e.preventDefault();
							e.stopImmediatePropagation();
							Post.push();
						}
					}
				});
			});
		} else {
			this.out = "//err: post type not defined";
		}
	};
	this.push = function(a) {
		var r = false,img=false,err,file;
		$('.box_input').each(function() {
			if($(this).val() != "") {
				r = true;
			} else {
				r = false;
			} 
		});
		if($('#post_image_input').val() != "") {
			var v = $("#post_image_input").val().split(".");
			if(v[1] == "jpg" || v[1] == "png" || v[1] == "jpeg" || v[1] == "gif") {
				r = true;
				img = true;
			} else {
				r = false;
				img = false;
				err = "image type not supported";
			}
		} else {
			r = true;
			img = false;
		}
		if(r) {
			var type = Post.type || "blog";
			var title = encodeURIComponent($("#post_title").val());
			var content = encodeURIComponent($("#post_content").val());
			var tags = encodeURIComponent($("#post_tags").val());
			var xhr = new XMLHttpRequest();
			xhr.open('POST','css/lib/pages/_post.php',true);
			if(img) {
				file = new FormData();
				file.append('img',document.getElementById("post_image_input").files[0]);
				file.append('post_type',type);
				file.append('post_title',title);
				file.append('post_content',content);
				file.append('post_tags',tags);
				xhr.upload.addEventListener('progress',function(e) {
					if(e.lengthComputable) {
						var pc = parseInt((e.loaded / e.total)*100);
						$('#post_image').children("span").html("Uploading "+pc+"%");
					}
				});
			} else {
				xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
				file = "post_type="+type+"&post_title="+title+"&post_content="+content+"&post_tags="+tags;
			}
			xhr.send(file);
			xhr.addEventListener('readystatechange',function() {
				if(xhr.status == 200 && xhr.readyState == 4) {
					if(xhr.responseText == "success") {
						terminal.write("//feed: your post has been posted");
						Post.close();
						load.content();
					} else {
						terminal.write(xhr.responseText);
					}
				}
			});
		} else {
			err = "you have missing fields";
			terminal.write("//err: "+err);
		}
	};
	this.delete = function(a) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST","css/lib/pages/_post.php",true);
		xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xhr.send("post_id_delete="+a);
		xhr.addEventListener('readystatechange',function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				if(xhr.responseText == "success") {
					load.content();
				} else {
					terminal.write(xhr.responseText);
				}
			}
		});
	};
	this.close = function() {
		$('#box_post').slideUp('normal',function() {
			$('#overlay').fadeOut('normal');
			$('#box_post').children("input,textarea").val("");
			$('#post_image').children("span").html('Upload an image');
		});
	};
}
function Terminal() {
	var Terminal = this;
	this.ui = $('#terminal');
	this.write = function(a) {
		Terminal.ui.val(a);
	};
	this.close = function() {
		$('#terminal').slideUp('normal');
	};
}
function Hash() {
	this.url = document.URL;
	this.listen = function() {
		if(window.location.href.indexOf("#!") > -1) {
			var path = window.location.hash;
			var kind = path.split("/")[1];
			var id = path.split("/")[2];
			var extra = path.split("/")[3];
			var load = new Load("css/lib/posts.php");
			if(path) {
				if(kind == "post") {
					load.content({id:id,customStyling:"style='height:auto;'"});
				} else if(kind == "tag") {
					load.content({tag:id});
				} else if(kind == "page") {
					var temps = ['post','item','form','manual'];
					var menuItem = document.getElementsByClassName("menuItem");
					var length = menuItem.length;
					for(var i=0;i<length;i++) {
						menuItem.item(i).className = "menuItem";
					}
					menuItem.item(id-1).className += " active";
					load.content({pageid:id,temp:temps[extra]});
				} else if(kind == "home") {
					$('#login').slideUp('normal');
					$('.menuItem').removeClass('active');
					load.content();
				} else if(kind == "admin") {
					var load = new Load("css/lib/pages/admin.php");
					load.target = $("#login");
					load.content();
					load.target.slideDown('slow');
				} else {
					var load = new Load("css/lib/posts.php");
					load.content({pagenotfound:404});
				}
			} else {
				$('.menuItem').removeClass('active');
				var load = new Load("css/lib/posts.php");
				load.content();
			}
		} else {
			window.location.assign("#!/home");
		}
	}
}
});