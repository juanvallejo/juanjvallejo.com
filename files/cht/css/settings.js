$(document).live("ready",function() {
	var ready = false;
	var key = false;
	var timeout = null;
	var content = new Content();
	var recordNum = null;
	var currentTitle = document.getElementsByTagName("title").item(0).innerHTML;
	var focus = true;
	var keyIsDown = false;
	content.load();
	
	$('#usernameInput').live("keyup",function(e) {
		var input = document.getElementById("usernameInput");
		var username = input.value;
		var alert = document.getElementById("usernameStatus");
		var numChars = username.split("").length;
		if(e.keyCode == 13) {
			if(ready) {
				input.disabled = "disabled";
				input.blur();
				alert.innerHTML = "Loading, please wait...";
				var content = new Content();
				content.startSession(username);
			}
		} else {
			if(numChars > 2 && numChars < 20) {
				if(!username.match(/[\ \@\;\:\.\-\!#$%\^\*\{}\[\]\?\,\'\"\`\>\<\/\\]/)) {
					alert.innerHTML = "Press ENTER to begin.";
					ready = true;
				} else {
					alert.innerHTML = "Your username contains invalid characters.";
					ready = false;
				}
			} else if(numChars <= 2) {
				if(numChars == 0) {
					alert.innerHTML = "Please enter a username.";
				} else {
					alert.innerHTML = "Your username is too short.";
				}
				ready = false;
			} else if(numChars >= 19) {
				alert.innerHTML = "Your username is too long.";
				ready = false;
			}
		}
	});
	$('#logout').live("click",function() {
		var content = new Content();
		content.endSession();
	});
	$('#messageInput').live("keydown",function(e) {
		if(e.keyCode == 13) {
			var input = document.getElementById("messageInput");
			var message = input.value;
			if(message != "") {
				if(message == "/save") {
					var dialog = new Dialog("Enter a password...");
					dialog.clearExisting();
					dialog.show();
					dialog.showOverlay(true);
					dialog.addInput("password");
					dialog.addText("Saving your account enables you to reserve your username by placing a password on it for future use. Press ESC to cancel.");
					dialog.addCloseEvent(27,function() {
						document.getElementById("messageInput").focus();
					});
					var saveAccountPasswordInput = document.getElementById(dialog.returnInputId);
					if(saveAccountPasswordInput !== null) {
						saveAccountPasswordInput.focus();
					}
					saveAccountPasswordInput.onkeydown = function(e) {
						if(e.keyCode == 13) {
							var content = new Content();
							content.postMessage("/save "+this.value);
						}
					}
				} else {
					var content = new Content();
					content.postMessage(message);
				}
			}
		}
	});
	
	$('#messages span.posted-link').live("click",function() {
		var src = $(this).attr('title');
		var ext = src.toLowerCase().split(".");
		var imageExt = ['png','jpg','gif','jpeg'];
		if($.inArray(ext[ext.length-1],imageExt) != -1) {
			var imageHolder = document.getElementById("currentImage");
			var content = document.getElementById("content");
			imageHolder.style.display = "none";
			imageHolder.innerHTML = "<img src='"+src+"' alt='image'/>";
			imageHolder.style.display = "block";
			$('#content #currentImage').live('click',function() {
				imageHolder.style.display = "none";
				imageHolder.innerHTML = '';
			});
		} else if(src.indexOf("youtube.com/watch?v=") != -1) {
			var source1 = src.split("http://www.youtube.com/watch?v=")[1];
			if(source1 === undefined) {
				source1 = src.split("https://www.youtube.com/watch?v=")[1];
			}
			var source = source1.split("&")[0];
			var imageHolder = document.getElementById("currentImage");
			var content = document.getElementById("content");
			imageHolder.style.display = "none";
			imageHolder.innerHTML = '<object data="http://www.youtube.com/v/'+source+'" type="application/x-shockwave-flash"><param name="src" value="http://www.youtube.com/v/'+source+'" /></object><span class="close-button"></span>';
			imageHolder.style.display = "block";
			$('#content #currentImage').live('click',function() {
				imageHolder.style.display = "none";
				imageHolder.innerHTML = '';
			});
		} else {
			window.open(src);
		}
	});
	$('#messages .item').live("click",function() {
		var id = $(this).children("#selectedPostId").html();
		if(keyIsDown) {
			var messageInput = document.getElementById("messageInput");
			messageInput.value += id;
			messageInput.focus();
		}
	});
	
	window.onkeydown = function(e) {
		if(e.shiftKey) {
			keyIsDown = true;
		}
	}
	window.onkeyup = function(e) {
		keyIsDown = false;
	}
	window.onblur = function() {
		setTimeout(function(){focus=false;},1000);
	};
	window.onfocus = function() {
		document.getElementsByTagName("title").item(0).innerHTML = currentTitle;
		focus = true;
	};

//functions	
function Content() {
	this.canvas = document.getElementsByTagName("body").item(0);
	this.load = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET","lib/get.content.php",true);
		xhr.send();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var content = new Content();
				content.canvas.innerHTML = xhr.responseText;
				var cookieexists = document.getElementById("cookieexists");
				var returninguser = document.getElementById("checkReturningUser");
				if(cookieexists.innerHTML != "") {
					key = true;
				}
				if(key) {
					if(returninguser === null) {
						var input = document.getElementById("messageInput");
						input.focus();
						messageLoop();
					} else {
						var content = new Content();
						content.endSession();
					}
				} else {
					var notices = document.getElementById("notices");
					var input = document.getElementById("usernameInput");
					if(navigator.userAgent.indexOf('Firefox') != -1) {
						notices.innerHTML = "Note: Firefox is not yet fully supported";
					} else {
						notices.style.display = "none";
					}
					input.focus();
				}
			} else {
				var content = new Content();
				content.canvas.innerHTML = "Error loading content.";
			}
		};
	};
	this.startSession = function(user,pass) {
		if(pass === undefined){pass='';}
		var xhr = new XMLHttpRequest();
		xhr.open("POST","lib/session.php",true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send("user="+user+"&pass="+pass);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				if(xhr.responseText == "success") {
					var content = new Content();
					content.load();
					key = true;
				} else {
					var input = document.getElementById("usernameInput");
					var alert = document.getElementById("usernameStatus");
					if(xhr.responseText == "savedAccountError") {
						var passwordInput = document.getElementById("passwordInput");
						passwordInput.parentNode.style.display="block";
						alert.innerHTML = "Username reserved, please authenticate to proceed. Press ESC to cancel.";
						passwordInput.focus();
						passwordInput.onkeydown = function(e) {
							if(e.keyCode == 27) {
								passwordInput.parentNode.style.display="none";
								input.removeAttribute('disabled');
								input.focus();
							} else if(e.keyCode == 13) {
								if(passwordInput.value != "") {
									var content = new Content();
									content.startSession(input.value,passwordInput.value);
								}
							}
						}
					} else {
						alert.innerHTML = xhr.responseText;
						var passwordInput = document.getElementById("passwordInput");
						if(passwordInput.parentNode.style.display == "none") {
							input.removeAttribute("disabled");
							document.getElementById("usernameInput").focus();
						}
					}
					
				}
			}
		};
	};
	this.endSession = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET","lib/logout.php",true);
		xhr.send();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				if(xhr.responseText == "success") {
					key = false;
					clearTimeout(timeout);
					var content = new Content();
					content.load();
				}
			}
		}
	};
	this.loadMessages = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET","lib/get.messages.php",true);
		xhr.send();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var messages = document.getElementById("messages");
				var span = messages.getElementsByTagName("span").item(0);
				if(key) {
					span.innerHTML = xhr.responseText;
				}
					var sessionStatus = document.getElementById("checkSessionStatus");
					var messageCount = document.getElementById("currentMessageCount");
					if(sessionStatus != null) {
						if(sessionStatus.innerHTML == "12") {
							key = false;
							var content = new Content();
							content.load();
						}
					} else if(messageCount != null) {
						if(recordNum === null) {recordNum = parseFloat(messageCount.innerHTML);}
						if(!focus && recordNum != parseFloat(messageCount.innerHTML)) {
							var newTitle = " [NEW MESSAGE]";
							document.getElementsByTagName("title").item(0).innerHTML = currentTitle+newTitle;
							recordNum = messageCount.innerHTML;
						}
					}
			}
		};
	};
	this.postMessage = function(message,recipient) {
		if(recipient === undefined){recipient="";}
		var xhr = new XMLHttpRequest();
		xhr.open("POST","lib/add.message.php",true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send("message="+encodeURIComponent(message)+"&recipient="+recipient);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				if(xhr.responseText == "success") {
					document.getElementById("messageInput").value = '';
					if(recordNum !== null) {
						recordNum++;
					}
					var content = new Content();
					content.loadMessages();
				} else if(xhr.responseText == "commandSuccess") {
					document.getElementById("messageInput").value = '';
					var dialog = new Dialog();
					dialog.clearExisting();
					dialog.show();
					dialog.showOverlay(true);
					dialog.addText("Changes applied successfully. Press ESC to close");
					dialog.addCloseEvent(27,function() {
						document.getElementById("messageInput").focus();
					});
				} else if(xhr.responseText.indexOf("commandDisplayPmScreen:") != -1) {
					var response = xhr.responseText.split(":");
					var dialog = new Dialog("Enter your message...");
					dialog.clearExisting();
					dialog.show();
					dialog.showOverlay(true);
					dialog.addInput("text");
					dialog.addText("You are sending a private message to "+response[2]+". Press ENTER to send, or ESC to cancel");
					if(document.getElementById(dialog.returnInputId) !== null) {
						var pmInput = document.getElementById(dialog.returnInputId);
						pmInput.focus();
						pmInput.onkeydown = function(e) {
							if(e.keyCode == 13) {
								var content = new Content();
								content.postMessage(pmInput.value,response[1]);
							}
						};
					}
					dialog.addCloseEvent(27,function() {
						document.getElementById("messageInput").focus();
					});
				} else {
					var messageInput = document.getElementById("messageInput");
					var dialog = new Dialog();
					dialog.clearExisting();
					dialog.show();
					dialog.showOverlay(true);
					dialog.addText(xhr.responseText+". Press ESC to close");
					dialog.addCloseEvent(27,function() {
						document.getElementById("messageInput").focus();
					});
				}
			}
		};
	};
	this.getStatus = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET","lib/get.status.php",true);
		xhr.send();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var status = document.getElementById("onlinestatus");
				if(status !== null) {
					status.innerHTML = xhr.responseText;
				}
			}
		};
	};
}
var DialogProperties = {textPositionTop:'100%',textWidth:'200%',textColor:'white',contentPositionTop:'32%'};
function Dialog(title) {
	this.title = title;
	this.canvas = document.getElementsByTagName("body").item(0);
	this.returnInputId = "saveAccountPassword";
	this.show = function() {
		this.showOverlay = function(bool) {
			if(bool === undefined) {bool = false;}
			if(bool) {
				this.canvas.innerHTML += "<div id='overlay'>";
			}
		}
		this.canvas.innerHTML += "<div id='mainDialogWindow' style='top:"+this.contentPositionTop+"'>";
	}
	this.addInput = function(inputType) {
		var mainDialogWindow = document.getElementById("mainDialogWindow");
		if(mainDialogWindow !== null) {
			mainDialogWindow.innerHTML += "<input type='"+inputType+"' id='"+this.returnInputId+"' placeholder='"+this.title+"'/>";
			var saveAccountPassword = document.getElementById("saveAccountPassword");
		}
	};
	this.addText = function(string) {
		mainDialogWindow.innerHTML += "<p style='text-align:center;width:"+this.textWidth+";font:inherit;color:"+this.textColor+";z-index:10;position:absolute;margin-left:-50%;margin-top:20px;top:"+this.textPositionTop+";' id='dialogText'>";
		var dialogText = document.getElementById("dialogText");
		if(dialogText !== null) {
			dialogText.innerHTML = string;
		}
	};
	this.addCloseEvent = function(key,callback) {
		var dialog = this;
		document.body.onkeydown = function(e) {
			if(e.keyCode == key) {
				var overlay = document.getElementById("overlay");
				var mainDialogWindow = document.getElementById("mainDialogWindow");
				if(overlay !== null) {
					dialog.canvas.removeChild(overlay);
				}
				if(mainDialogWindow !== null) {
					dialog.canvas.removeChild(mainDialogWindow);
				}
				if(typeof callback == "function") {
					callback.call(this);
				}
			}
		}
	};
	this.addOpenEvent = function(callback) {
		if(typeof callback == "function") {
			if(document.getElementById("mainDialogWindow") !== null)
				callback.call(this);
		}
	};
	this.clearExisting = function() {
		var overlay = document.getElementById("overlay");
		var mainDialogWindow = document.getElementById("mainDialogWindow");
		if(overlay !== null) {
			document.body.removeChild(overlay);
		}
		if(mainDialogWindow !== null) {
			document.body.removeChild(mainDialogWindow);
		}
	};
}
Dialog.prototype = DialogProperties;
function messageLoop() {
	var content = new Content();
	content.loadMessages();
	content.getStatus();
	if(key) {
		timeout = setTimeout(messageLoop,4500);
	}
}
});