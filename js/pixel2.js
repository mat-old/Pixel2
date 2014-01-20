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
			color 	= new Array(),
			PAL 	= new Array();
			SYM 	= new Array();
		var collection="", r, g, b, pixel = 0;
	if(!width || !height) return ;

	context.drawImage(image, 10, 10);
	var data = context.getImageData(0, 0, width, height).data;
	//var SYM = {}
	for(var i=0, n=data.length; i<n; i+=4, pixel++ ) {
		r = data[i];
		g = data[i+1];
		b = data[i+2];

		collection =  r + ", " + g + ", " + b

		if(r+g+b != 0 && r+g+b != 255*3) {
			color[pixel] = collection; 
		}
		SYM[pixel] = collection;
	}

	color	= monoFilter(color);
	RGBA	= cssFormat(color);
	PAL 	= palFormat(color);
	$('#palcode').append(PAL.join("\n<br>") + "\n");
	//$('#palcode').append("\n");

	SYM 	= colorPaletteFilter(SYM, color);
	SYM 	= symFormat(SYM);
	$('#symcode').append(SYM.join("\n<br>") + "\n");

	Say(256-color.length+" Unused palette indexes");

	if(RGBA.length > 256) { Say("<red>The image has more than 256 colors.</red>");
	} else Say("<blue>The image has less than or equal then 256 colors.</blue>");

	Say("H:" + height + "  W:" + width + " Colors:" + RGBA.length);

	for(n=0; n < RGBA.length; n++ )
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

	for(i=s.length-1; i<255; i++)
		s[i] = "RGB(0, 0, 0)";
	if(i==255) s[i] = "RGB(255, 255, 255)"

	return s;
}

function symFormat(s) {
	var s2 = s.splice(0);
	var sym = new Array();
	var icon = 0;
	sym[0] = "/* Element 0x0000 - Char 0x0000 */";
	sym[1] = "{{ 0, 8, 32, 32 },{";

	for(var i=2; i<s2.length; i++) {
		sym.push(s2[i]+",");
		if(i%(32*32)==0) {
			sym.push("}},<br>");
			sym.push("/* Element 0x00"+hex2(icon)+" - Char 0x00"+hex2(icon)+" */");
			sym.push("{{ 0, 8, 32, 32 },{");
			icon++;
		}
	}
	sym[sym.length-1] = sym[sym.length-1].substring(0, sym[sym.length-1].length - 1);
	sym.push("}}");
	//Say();
	//$('#symcode').append(SYM.join(",\n<br>") + "\n");

	sym.unshift("/*V F 12 3 32 32 N Q  PAL<pixel2.pal>  pixel2.sym   LCDIcon FileDescriptor: Do not edit or move */\n<br>/* Put Your Comments Here */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>/* */\n<br>\n<br>\n<br>");
	return sym;
}



function palFormat(s) {
	var i, pal;
	s = s.slice(0); // make a shallow copy
	for(i=0;i<s.length;i++) {
		pal = s[i].match(/\d+/g).map(Number);
		s[i] = "{" + hex(pal[0]) + ", " + hex(pal[1]) + ", " + hex(pal[2]) + "},";
	}

	pal = s[s.length-1];
	for(i=s.length-1; i<255; i++)
		s[i] = "{0x00, 0x00, 0x00},";
	if(i==255) s[i] = pal;

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

function hex2(n) {
	n = n.toString(16).toUpperCase();
	if(n.length == 1) n = "0" + n;// else n = "0x" + n;
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

function utfFormat(s) {
	//var utfstr = "¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";
	var n, i;
	blob = new Array();
	s = s.replace(/\{|0x|\}|\,|\/.*.\/|\s/gi," ").split(" ");//.split(/(?=(?:..)*$)/ );

	for(n=0,i=0;n<s.length;n++)
		if(s[n].match(/^[A-Z0-9]*[A-Z0-9][A-Z0-9]*$/)) { blob[i] = hex2a(s[n]); i++; }

	//Say(blob.join(", "));
	return blob;
}

function download(filename, text) {

	//text = utfFormat(text);
	
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=ANSI,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}



function hex2a(hexx) {
    var hex2 = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex2.length; i += 2)
        str += String.fromCharCode(parseInt(hex2.substr(i, 2), 16));
    return str;
}


function colorPaletteFilter(s, p) {
	var s2 = s.splice(0);
	var pal = {}
	var sym = new Array();

	for(var i=0; i<p.length; i++) 
		pal[p[i]] = i;

	//Say(pal[s2[4]]);

	for(var i=0; i<s2.length; i++) 
		sym[i] = hex(pal[s2[i]].toString());

	//Say(sym.join(",\n<br>"))
	//Say(s2[4] + " @ " + pal[s2[4]] + " " + sym.length + " total indexed pixels" );

	return sym;
}


Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

Array.prototype.hexit = function() {
  for (var i = 0; i < this.length; i++) {
  	this[i] = hex2a(this[i]);
  }
  return this;
};