var objects = [];
objects.push(document.createElement("div"));
objects.push(document.createElement("div"));
objects.push(document.createElement("canvas"));
objects[0].id = "syntax";
objects[0].className = "note";
objects[0].innerHTML = Site.getDemoSyntax();
objects[1].id = "preview";
objects[1].className = "note note-back";
objects[2].appendTo = objects[1];
objects[2].addEventListener('focus',function() {
	Site.canvasFocused = true;
});
objects[2].addEventListener('blur',function() {
	Site.canvasFocused = false;
});

window.addEventListener('load',function() {
	if(window.location.href.split("//")[1].split("/")[2] != "juan" && window.location.href.split("//")[1].indexOf("techboxcoding") == -1 && window.location.href.split("//")[1].indexOf("juanjvallejo") == -1) {
		window.Lib = null;
		throw "Validation Error: You are using an unauthorized copy of Lib.js.";
	}
	Site.loaded = true;
	Site.manageMenuLabels();
	var wrapper = document.getElementById("note-wrapper");
	if(wrapper) {
		for(var i=0;i<objects.length;i++) {
			if(!objects[i].appendTo) wrapper.appendChild(objects[i]);
			else objects[i].appendTo.appendChild(objects[i]);
		}
		objects[2].width = objects[2].appendTo.clientWidth;
		objects[2].height = objects[2].appendTo.clientHeight;
		Site.manageNotes();
	}
	Site.resizeDocContent();
	Site.parseCodeSamples("doc-content");
	Site.parseCodeSamples("demo-wrapper");
	Site.parseCodeSamples(objects[0]);
	Site.manageCompatibilityIcons();
	Site.manageSidebar();
});
window.addEventListener('resize',function() {
	if(Site.loaded) {
		Site.manageNotes();
		Site.resizeDocContent();
	}
});

var MY_CANVAS_ELEMENT = objects[2];
