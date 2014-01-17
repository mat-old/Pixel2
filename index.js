var server = require("./server");
var router = require("./router");
var requestHandlers= require("./requestHandlers");

var handle = {}
handle[""] 		= requestHandlers.wake;
handle["wake"] 	= requestHandlers.wake;
handle[".css"]	= requestHandlers.css;
handle[".ico"]	= requestHandlers.favicon;
handle[".gif"]	= requestHandlers.gif;
handle[".jpg"]	= requestHandlers.jpg;
handle[".png"]	= requestHandlers.png;
handle[".js"]	= requestHandlers.js;
handle[".map"]	= requestHandlers.js;
handle["message"]=requestHandlers.email;

server.wake(router.route, handle);