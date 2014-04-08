var Syntax = {
	color:function(a,b) {
		return "<span style='color:"+b+";'>"+a+"</span>";
	},
	parse:function(a) {
		var self = this;
		var doc = typeof a == 'string' ? document.getElementById(a) : a;
		if(doc) {
			var pre = doc.getElementsByTagName("pre");
			for(var i=0;i<pre.length;i++) {
				var word = pre[i].innerHTML.split("\n");
				for(var x=0;x<word.length;x++) {
					if(word[x].match(/\/\//gi)) {
						var w = word[x].split("//");
						var temp = parseString(w[0]);
						var comm = self.color("//"+w[1],"rgba(169,112,112,0.8)");
						word[x] = temp+comm;
					} else {
						word[x] = parseString(word[x]);
					}
				}
				pre[i].innerHTML = word.join("\n").replace(/\t/gi,'').replace(/  /gi,"&nbsp;&nbsp;&nbsp;");
			}
		}
		function parseString(a) {
			var word = a.replace(/\</gi,"&lt").replace(/\>/gi,"&gt").replace(/\=/gi,"&#61").replace(/\+/gi,"&#43");
			if(word.match(/\&lt\;\!\-\-/gi)) {
				var str = word.replace(/(\&lt\;\!\-\-(.*)\-\-\&gt\;)/gi,self.color("$1","grey"));
				word = str;
			} else {
				if(word.match(/[^&#0-9](?![a-z])[0-9]+(?!\w+)(?!\')(?!\")/gi)) {
					var str = word.replace(/([0-9]+)/gi,self.color("$1","rgb(165,87,190)"));
					word = str;
				}
				if(word.match(/(&#61|&#43)/gi)) {
					var str = word.replace(/(&#61|&#43)/gi,self.color("$1","rgb(247,121,145)"));
					word = str;
				}
				if(word.match(/(\&lt\;|&lt;\/)([a-z]+)\&gt\;/gi)) {
					var str = word.replace(/(\&lt\;|\&lt\;\/)([a-z]+)(\&gt\;)/gi,"$1"+self.color("$2","rgb(247,121,145)")+"$3");
					str = str.replace(/(\&lt\;)([a-z]+)(\ )/gi,"$1"+self.color("$2","rgb(247,121,145)")+"$3");
					word = str;
				} 
				if(word.match(/(if)(?=\()/gi)) {
					var str = word.replace(/(if)(?=\()/gi,self.color("$1","rgb(247,121,145)"));
					word = str;
				}
				if(word.match(/(else)/gi)) {
					var str = word.replace(/(else)/gi,self.color("$1","rgb(247,121,145)"));
					word = str;
				}
				if(word.match(/(&amp;&amp;)/gi)) {
					var str = word.replace(/(&amp;&amp;)/gi,self.color("$1","rgb(247,121,145)"));
					word = str;
				}
				if(word.match(/(\|\|)/gi)) {
					var str = word.replace(/(\|\|)/gi,self.color("$1","rgb(247,121,145)"));
					word = str;
				}
				if(word.match(/(return)(?=\ )/gi)) {
					var str = word.replace(/(return)(?=\ )/gi,self.color("$1","rgb(247,121,145)"));
					word = str;
				}
				if(word.match(/(var)(?=\ )/gi)) {
					var str = word.replace(/(var)(?=\ )/gi,self.color("$1","rgb(121,208,247)"));
					word = str;
				}
				if(word.match(/(function\(\))/gi)) {
					var str = word.replace(/(function)(?=\(\))/gi,self.color("$1","rgb(121,208,247)"));
					word = str;
				}
				if(word.match(/(window\.)/gi)) {
					var str = word.replace(/(window)(?=\.)/gi,"<i>"+self.color("$1","rgb(121,208,247)")+"</i>");
					word = str;
				}
				if(word.match(/\((window|document)\)/gi)) {
					var str = word.replace(/(window|document)/gi,"<i>"+self.color("$1","rgb(121,208,247)")+"</i>");
					word = str;
				}
				if(word.match(/\((this)\)/gi)) {
					str = word.replace(/(this)/gi,"<i>"+self.color("$1","rgb(160,179,198)")+"</i>");
					word = str;
				}
				if(word.match(/(this)(?=[\.\;])/gi)) {
					var str = word.replace(/(this)(?=[\.\;])/gi,self.color("$1","rgb(121,208,247)"));
					word = str;
				}
				if(word.match(/(.log)(?=\()/gi)) {
					var str = word.replace(/(log)(?=\()/gi,self.color("$1","rgb(121,208,247)"));
					word = str;
				}
				if(word.match(/(null|true|false)/gi)) {
					var str = word.replace(/(null|true|false)/gi,self.color("$1","rgb(165,87,190)"));
					word = str;
				}
			//	if(word.match(/((\"|\')[a-z0-9\/\_\ \.\-\#]+(\"|\'))/gi)) {
			//		var str = word.replace(/((\"|\')+[a-z0-9\/\_\ \.\-\#]+(\"|\'))/gi,self.color("$1","rgb(247,223,121)"));
			//		word = str;
			//	}
				if(word.match(/([^\<\>\:])(\"|\')([^\'\"\:\<\>]*)([\:]+)([^\'\"\:\<\>]*)(\"|\')([^\<\>\:])/gi)) {
					var str = word.replace(/([^\<\>\:])(\"|\')([^\'\"\:\<\>]*)([\:]+)([^\'\"\:\<\>]*)(\"|\')([^\<\>\:])/gi,"$1$2$3&#58;$5$6$7");
					word = str;
				}
				if(word.match(/((\'|\")([^\'\"\:\<\>]+)(\'|\"))/gi)) {
					var str = word.replace(/((\'|\")([^\'\"\:\>\<]+)(\"|\'))/gi,self.color("$1","rgb(247,223,121)"));
					word = str;
				}
			}
			return word;
		}
	}
};

window._RotationAnimationHN = "juanjvallejo.com";
window.addEventListener('load',function() {
	var button = document.getElementById("submit");
	var code = document.getElementsByClassName("note-syntax");
	var currentGroupItem = "home";
	var demoButton = document.getElementById("demo-button");
	var groupItem = document.getElementsByClassName("note-group");
	var menuItem = document.getElementById("menu-item-holder");
	var nextGroupItem;
	function show(page) {
		if(document.getElementById(page)) {
			window.location.assign('#'+page);
			nextGroupItem = page;
			if(nextGroupItem != currentGroupItem) {
				$('#'+currentGroupItem).fadeOut('normal',function() {
					$('#'+nextGroupItem).fadeIn('slow');
					currentGroupItem = nextGroupItem;
				});
			}
		}
	}
	for(var i=0;i<code.length;i++) {
		Syntax.parse(code.item(i));
	}
	if(window.location.hash) {
		show(window.location.hash.split("#")[1]);
	} else window.location.assign("#home");
	window.addEventListener('hashchange',function() {
		show(this.location.hash.split("#")[1]);
	});
	if(menuItem) {
		menuItem = menuItem.children;
		for(var i=0;i<menuItem.length;i++) {
			menuItem.item(i).addEventListener("click",function() {
				show(this.innerHTML.toLowerCase());
			});
		}
	}
	if(demoButton) {
		demoButton.addEventListener('click',function() {
			show("demos");
		});
	}
	if(button) {
		button.addEventListener('click',function() {
			var self = this;
			var inputs = document.getElementsByClassName("_contact-form-item");
			var ready = true;
			for(var i=0;i<inputs.length;i++) {
				if(inputs.item(i).value == "") ready = false;
			}
			if(ready) {
				if(!self.disabled) {
					if(inputs.item(0).value.match(/^[a-z0-9\.\:\+\_\-]+(@){1}([a-z0-9\_\-\+])+(\.){1}([a-z0-9]){2,7}$/gi)) {
						self.disabled = true;
						tell("Sending, please wait...",false);
						for(var i=0;i<inputs.length;i++) {
							inputs.item(i).disabled = true;
						}
						var body = encodeURIComponent("From: "+inputs.item(0).value+"\n\n"+inputs.item(1).value);
						var subject = encodeURIComponent("RotatAnim (0.4.5+) Message");
						var xhr = new XMLHttpRequest();
						xhr.open("POST","data.php",true);
						xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
						xhr.send("type=message&body="+body+"&subject="+subject);
						xhr.addEventListener('readystatechange',function() {
							if(this.status == 200 && xhr.readyState == 4) {
								if(this.responseText == "success") {
									for(var i=0;i<inputs.length;i++) {
										inputs.item(i).removeAttribute('disabled');
										inputs.item(i).value = "";
									}
									self.disabled = false;
									tell("Your message has been sent");
								} else {
									var ServerErrorKey = {
										"Error 1":"Request type not specified",
										"Error 2":"There was an error sending your message"
									}
									if(this.responseText.split(" ")[0] == "Error") tell(ServerErrorKey[this.responseText]);
									else tell(this.responseText);
								}
							}
						});
					} else {
						tell("Please enter a valid email");
					}
				} else tell("The form is still submitting. Please wait...",false);
			} else tell("You have missing fields");
			function tell(a,b) {
				b = b === undefined ? true : false;
				var sibbling = self.parentNode.children[1];
				var timeout;
				sibbling.children[0].innerHTML = a;
				if(!self.hasAlert) {
					self.hasAlert = true;
					$(sibbling).slideDown('normal');
					if(timeout) clearTimeout(timeout);
					if(b) {
						timeout = setTimeout(function() {
							self.hasAlert = false;
							$(sibbling).slideUp('normal');
						},10000);
					}
				}
			}
		});
	}
});