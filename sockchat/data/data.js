window.onload = function() {
	if('WebSocket' in window) {
		var s = new Socket();
		var ms = document.getElementById("messages");
		var tx = document.getElementById("textbox_input");
			tx.addEventListener('keydown',function(e) {
				if(e.keyCode == 13) {
					var that = this;
					if(this.value != "") s.send(this.value,function(d) {
						that.value = "";
						ms.innerHTML += "<p>"+d+"</p>";
					});
				}
			});
	} else {
		console.log("Web sockets are not supported by this browser");
	}
	function Socket() {
		var that = this;
		this.close = "you have been disconnected";
		this.error = null;
		this.open = undefined;
		this.out = "";
		this.url = "ws://echo.websocket.org";
		this.send = function(a,b) {
			ws = new WebSocket(this.url);
			ws.addEventListener('open',function(e) {
				if(that.open && typeof that.open == 'function') {
					that.open.call(that,e);
				} else {
					that.out = "you have been connected";
				}
				ws.send(a);
			});
			ws.addEventListener('message',function(e) {
				that.out = e.data;
				if(typeof b == "function") {
					b.call(that,e.data);
				}
				ws.close();
			});
			ws.addEventListener('close',function() {
				that.out = that.close;
			});
			ws.addEventListener('error');
		};
	}
};