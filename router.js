var allpaths = require('path');

function route(handle, path, response, request) {
	console.log("Act - "+path);
	var copy = path;
	if(path.match(/\./g)) {
		copy = allpaths.extname(path);
		//console.log(path); //this is for unconventional req debugging
	}

	if (typeof handle[copy] === 'function')
		return handle[copy](response, request, path);
	else
	{
		console.log("**NoH - "+path);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("404 Not found.");
		response.end();
	}
}

exports.route = route;