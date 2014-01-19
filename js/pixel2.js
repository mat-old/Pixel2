function convert(image)
{
	var canvas = document.getElementById('myCanvas');
	var codearea = document.getElementById('codearea');
	var messages = document.getElementById('message_area');
	var context = canvas.getContext('2d');
		
		var imageX = 0, imageY = 0;
		var width = image.width,
			height = image.height;
		var RGBA	= new Array(),
			color 	= new Array();
			PAL = new Array();
		var collection="", r, g, b, pixel = 0;
	if(!width || !height) return ;

	context.drawImage(image, 10, 10);
	var data = context.getImageData(0, 0, width, height).data;

	for(var i=0, n=data.length; i<n; i+=4, pixel++ ) {
		r = data[i];
		g = data[i+1];
		b = data[i+2];

		if(r+g+b != 0 && r+g+b != 255*3) {
			color[pixel] = r + ", " + g + ", " + b; 
		}
	}

	color	= monoFilter(color);
	PAL 	= palFormat(color);
	$('#palcode').append(PAL.join("<br>"));
	RGBA	= cssFormat(color);
	//SYM		= symFormat(color);
	//$('#symcode').append(SYM.join("<br>"));

	Say(256-color.length+" Unused palette indexes");

	for(n=PAL.length; n<=255; n++)
		PAL[n] = "<li id='c"+n+"' class='li-next'>"+"{0x00, 0x00, 0x00},"+"</li>";
	for(n=RGBA.length; n<=255; n++)
		RGBA[n] = "RGB(0,0,0)";

	if(RGBA.length > 256) Say("<red>The image has more than 256 colors.</red>");

	Say("H:" + height + "  W:" + width + " Colors:" + PAL.length);

	for(n=0; n < color.length; n++ )
		$('#sortable').append("<li class='ui-state-default'><box id="+n+" style='background-color:"+RGBA[n]+";'>"+n+"</box></li>");
	
}

function filterSort(a) {
	return a.reverse().filter( function(e, i, ary) {
	    return ary.indexOf(e, i+1) === -1;
	}).reverse();
}

function generate(imgdata) {
      var imageObj = new Image();
      imageObj.src = imgdata;
      convert(imageObj);
}

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}

function Say(s) {
	var messages = document.getElementById('message_area');
	messages.innerHTML += "<li class='li-next'>" + s + "</li>";
}

function cssFormat(s) {
	var i, css;
	s = s.slice(0);
	for(i=0;i<s.length;i++) {
		css = s[i].match(/\d+/g).map(Number);
		s[i] = "RGB("+css[0]+", "+css[1]+", "+css[2]+")";
	}
	return s;
}


function palFormat(s) {
	var i, pal;
	s = s.slice(0); // make a shallow copy
	for(i=0;i<s.length;i++) {
		pal = s[i].match(/\d+/g).map(Number);
		s[i] = "{" + hex(pal[0]) + ", " + hex(pal[1]) + ", " + hex(pal[2]) + "},";
	}
	s[s.length-1] = s[s.length-1].substring(0, s[s.length-1].length - 1);
	s.unshift("{");
	s.unshift("/*V P C 0 256 8 8 8 8 256 24 0  pixel2pal   LCDIcon FileDescriptor: Do not edit or move */");
	s.push("}");
	return s;
}

function hex(n) {
	n = n.toString(16).toUpperCase();
	if(n.length == 1) n = "0x0" + n; else n = "0x" + n;
	return n;
}

function monoFilter(s) {
	var unique = [];
	$.each(s, function(i, el){
	    if($.inArray(el, unique) === -1) unique.push(el);
	});
	unique.splice(0,1);
	unique.unshift("0, 0, 0");
	unique.push("255, 255, 255");
	return unique;
}
