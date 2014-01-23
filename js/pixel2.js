{ //scope
var raw = new Array()
var index = {}
var cons = {}
var ico 	= new Number
var area 	= new Number
var width, height

function generate(imgdata) {
	var imageObj = new Image();
	imageObj.src = imgdata;
	convert(imageObj);
}

function convert(image)
{
	var canvas = document.getElementById('myCanvas');
		ico = document.getElementById('icoSize').value
		width = image.width
		height = image.height
		area = width*height
		canvas.width = width
		canvas.height = height
	var context = canvas.getContext('2d');
		cons = document.getElementById('message_area');
	var collection="", r, g, b, pixel;
	context.drawImage(image, 0, 0);
	var data = context.getImageData(0, 0, width, height).data;

	index["0, 0, 0"] = 0
	index["255, 255, 255"] = 255
	for(var i=0, pixel=0, j=1, n=data.length; i<n; i+=4, pixel++ ) {
		r = data[i]
		g = data[i+1]
		b = data[i+2]

		collection =  r + ", " + g + ", " + b
		raw[pixel] = collection

		if( !(collection in index) )
			index[collection] = j++
	}

	var palette = {}
		palette = raw.minify()

	palette.toRGBpanel()
	palette.toPALpanel()

	data = new Array()
	data = buildIndicis(index, raw)
	data.toSYMpanel()

	res = "Colors: "+palette.length
	res.toConsole()
	res = width+"x"+height+" = "+width*height+" pixels"
	res.toConsole()
	res = 256 - palette.length + " indicis left."
	res.toConsole()
	if(raw.length != data.length) {
		"ERROR.SYM encoding does not match length of file.".toConsole()
		res = "Data:" + data.length + "\tIndex:" + index.length + "\tPixels:" + pixel
			res.toConsole()
	}
		
}

function buildIndicis(index, dat) {
	var sym = new Array()
	for(var i=0; i<dat.length; i++)
		sym[i] = index[dat[i]].hex()
		//$('#symcode').append("<box2 style='background-color:RGB("+dat[i]+");'></box2"); //this does something funny ;)
	return sym
}
function constructAssociation(rgb) {
	var s = {}
	var j = 0
	for(var n=0; n<rgb.length; n++)
		if(!(rgb[n] in s))
			s[rgb[n]] = j++
	return s
}
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}
Array.prototype.toSYMpanel = function() {
	var icon = {}
	var text = ""
	var	a, b , c , d, i
	el = this[0].length + 1
	i=0
	
	for(a=0;a<height/ico;a++) //sprites are n^2^2
		for(b=0;b<ico;b++)
			for(c=0;c<width/ico;c++)
				for(d=0;d<ico;d++)
					icon[a+","+c]+=this[i++]+",<br>\n"
	//alert(width/ico + " " + height/ico + " " + i)
	i=0
	for(a=0;a<height/ico;a++)
		for(c=0;c<width/ico;c++) {
			text += "/* Element 0x00"+(i++).hex().replace("0x","")+" - Char 0x00"+i.hex().replace("0x","")+" */<br>\n{{ 0, 8, 32, 32 },{\n<br>"
			text += icon[a+","+c].replace("undefined","")
			text += "}},\n<br>\n<br>"
		}
		
	$('#symcode').prepend(text.substring(0, text.length - 19))
	$('#symcode').append("\n<br>}}\n\n");
	$('#symcode').prepend("/*V F 12 3 32 32 N Q  PAL<pixel2.pal>  pixel2.sym   LCDIcon FileDescriptor: Do not edit or move */\n<br>/* Put Your Comments Here */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>\n<br>\n<br>");		//$('#symcode').append((i++) + " " + icon[a+","+c].length+"<br>");
}
Array.prototype.toPALpanel = function() {
	$('#palcode').empty();
	$('#palcode').append("/*V P C 0 256 8 8 8 8 256 24 0  pixel2pal   LCDIcon FileDescriptor: Do not edit or move */\n<br>{\n<br>");
	for(var i=0; i<this.length-1; i++)
		$('#palcode').append("{"+this[i].hex16()+"},\n<br>");
	for(;i<255;i++)
		$('#palcode').append("{0x00, 0x00, 0x00},\n<br>");

	$('#palcode').append("{"+this[this.length-1]+"}\n<br>");
	$('#palcode').append("}\n");
}
Array.prototype.toRGBpanel = function() {
	$('#sortable').empty();
	for(var i=0; i<this.length-1; i++)
		$('#sortable').append("<li class='ui-state-default'><box style='background-color:RGB("+this[i]+");'>"+i+"</box></li>");
	for(;i<255;i++)
		$('#sortable').append("<li class='ui-state-default'><box style='background-color:RGB(0, 0, 0);'>"+i+"</box></li>");

	$('#sortable').append("<li class='ui-state-default'><box style='background-color:RGB("+this[this.length-1]+");'>"+i+"</box></li>");
}
Array.prototype.minify = function() {
	var unique = []
	$.each(this, function(i, el){
	    if($.inArray(el, unique) === -1 && el!="255, 255, 255" && el!= "0, 0, 0") unique.push(el);
	});
	unique.unshift("0, 0, 0")
	unique.push("255, 255, 255")
	return unique
}
Array.prototype.toIndex = function() {
	for(var i=0; i<this.length; i++)
		color[this[i]] = i;
}
Array.prototype.toConsole = function() {
		this.join("\n<br>").toConsole()
}
Array.prototype.toRaw = function() {
	var s = new Array()
	var n
	$.each(this, function(i, el){ 
		n = el.match(/\d+/g).map(Number);
		s[i] = n[0] + ", " + n[1] + ", " + n[2];
	});
	return s
}
String.prototype.toConsole = function() {
	cons.innerHTML += "<li class='li-next'>" + this + "</li>"
}
String.prototype.hex16 = function() {
	var s = this.match(/\d+/g).map(Number);
		return s[0].hex() + ", " + s[1].hex() + ", " + s[2].hex();
}
Number.prototype.hex = function() {
	var s = this.toString(16).toUpperCase(); 
	if(s.length == 2) return "0x" + s
		else return "0x0" + s
}
} //end scope