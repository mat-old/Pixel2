var fs  = require("fs");

function wake(response) {
	console.log("\n**NEW CON");
	fs.readFile('index.html', function(err, html) {
		response.writeHead(200, {"Content-Type":"text/html"});
		response.write(html);
		response.end();	
	});
}

function css(response, request, path) {
	path="css/"+path;

	fs.readFile(path, function(err, css) {
		response.writeHead(200, {"Content-Type":"text/css"});
		response.write(css);
		response.end();	
	});
}

function gif(response, request, path) {
	var res = path.match(/css/g);
	if(!res) path="css/"+path;

	fs.readFile(path, function(err, gif) {
		response.writeHead(200, {"Content-Type":"image/gif"});	
		response.end(gif, 'binary');
	});
}

function jpg(response, request, path) {
	var res = path.match(/css/g);
	if(!res) path="css/"+path;

	fs.readFile(path, function(err, jpg) {
		if(err) return;
		response.writeHead(200, {"Content-Type":"image/jpg"});	
		response.end(jpg, 'binary');
	});
}

function png(response, request, path) {
	var res = path.match(/css/g);
	if(!res) path="css/"+path;

	fs.readFile(path, function(err, png) {
		if(err) console.log("**404 - "+path);
		response.writeHead(200, {"Content-Type":"image/png"});	
		response.end(png, 'binary');
	});
}

function js(response, request, path) {
	path = "js/"+path;

	fs.readFile(path, function(err, js) {
		if(err) return;
		response.writeHead(200, {"Content-Type":"text/javascript"});	
		response.end(js);
	});
}

function favicon(response) {
	fs.readFile('favicon.ico', function(err, ico) {
		if(err) return;
		response.writeHead(200, {"Content-Type":"image/ico"});	
		response.end(ico, 'binary');
	});
}

function email(response) {
	//response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("message time");
	response.end();
}

exports.wake = wake;
exports.css = css;
exports.gif = gif;
exports.jpg	= jpg;
exports.png	= png;
exports.js	= js;
exports.favicon = favicon;
exports.email	= email;