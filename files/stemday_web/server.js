var fs = require('fs');
var server = require('http').createServer(server).listen(8000);

function server(req,res) {
		var Type = {
			'css':'text/css',
			'html':'text/html',
			'jpg':'image/jpeg',
			'jpeg':'image/jpeg',
			'js':'application/javascript',
			'map':'application/x-navimap',
			'pdf':'application/pdf',
			'png':'image/png',
			'txt':'text/plain'
		};

		var path = req.url == '/' ? 'index.html' : req.url;
		var file = path.split("/");
		var ext = 'txt';
		
		file = file[file.length-1];
		ext = file.split(".");
		ext = ext[ext.length-1];

		fs.readFile(__dirname+'/'+path,function(err,data) {
			if(err) {
				res.writeHead(404);
				return res.end("The file '"+path+"' could not be found.");
			}
			res.writeHead(200,{'Content-type':(Type[ext] || Type["text"])});
			res.end(data);
		})
}