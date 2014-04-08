window.onload = function() {
	var hash = new Hash();
	var menu = document.getElementById("menu");
	var li = menu.getElementsByTagName("li");
	var logo = document.getElementById("object");
	var data = null;
	var currentState = null;
	
	hash.getContent();
	window.onhashchange = function() {
		hash.getContent();
	}
	
	for(var b=0;b<li.length;b++) {
		li.item(b).onclick = function() {
			window.location.hash = this.title;
			for(var c=0;c<li.length;c++) {
				li.item(c).className = "";
			}
			this.className = "selectedMenuItem";
		};
	}	
	
	function Hash() {
		this.getHash = function() {
			return window.location.hash.split("#")[1];
		};
		this.getContent = function() {
			if(currentState !== null) {
				document.getElementById(currentState).style.display = "none";
			}
			if(this.getHash() !== undefined) {
				if(this.elementExists()) {
					currentState = this.getHash();
					for(var c=0;c<li.length;c++) {
						li.item(c).className = "";
					}
					for(var i=0;i<li.length;i++) {
						if(li.item(i).title == this.getHash()) {
							li.item(i).className = "selectedMenuItem";
							break;
						} else {
							li.item(i).className = "";
						}
					}
					document.getElementById(this.getHash()).style.display='block';
					document.getElementById("404").style.display='none';
				} else {
					document.getElementById("404").style.display='block';
				}
			} else {
				window.location.hash = li.item(0).title;
			}
		};
		this.elementExists = function() {
			var checkUndefinedState = document.getElementById(this.getHash());
			if(checkUndefinedState !== null) {
				return true;
			} else {
				return false;
			}
		};
		this.change = function(url) {
			window.location.hash = url;
		}
	}
};