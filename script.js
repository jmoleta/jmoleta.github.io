/*
Linear regression
y = a + bx
*/

const imagem = document.getElementById("pictureFromCamera");
const cnv = document.getElementById('myCanvas');
const ctx = cnv.getContext('2d');

cnv.width = window.innerWidth; //2128 1064
cnv.height = window.innerHeight; //965 482
//856x960

var inicio = 0;
var escala = 1;
var escalamin = 1;
var escalamult = 0.001;
var escalaAtual = 1;
var tX = 0;
var tY = 0;
var posX = 0;
var posY = 0;
var dist = 0;

var minX = 0;
var minY = 0;
var maxX = 0;
var maxY = 0;

var raio = 0;

var press = false;
var temImagem = false;

var dedos = 0;

// coeficiente angular (a) e linear (b) de r, g e b
var ra = 3.757672456;
var rb = -15.78272256;
var ga = 2.176317657;
var gb = -84.17929872;
var ba = 3.140141857;
var bb = -19.84991797;
// var ra = 2.491946479;
// var rb = 29.96781497;
// var ga = 1.176538324;
// var gb = 16.96272588;
// var ba = 3.205720855;
// var bb = -8.600020179;

// concentração por r, g e b
var rc = 0;
var gc = 0;
var bc = 0;

imagem.addEventListener('load', function() {
	tX = 0;
	tY = 0;
	raio = 0;
	if (imagem.naturalWidth < parseInt(window.innerWidth / 2))
		tX = parseInt(window.innerWidth / 2) - imagem.naturalWidth;
	if (imagem.naturalHeight< parseInt(window.innerHeight / 2))
		tY = parseInt(window.innerHeight / 2) - imagem.naturalHeight;
	escala = Math.min(cnv.width / imagem.naturalWidth, cnv.height / imagem.naturalHeight);
	escalamin = escala;
	temImagem = true;
	redraw();
});

document.getElementById("imageFileInput").addEventListener("change", function () {
    imagem.setAttribute("src", window.URL.createObjectURL(this.files[0]));
});

function redraw()
{
	if (temImagem) {
		//ctx.save();
		//ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, cnv.width, cnv.height);
		//ctx.restore();
		
		//ctx.scale(escala,escala);
		//ctx.translate(tX, tY);
		
		if (escala < escalamin) escala = escalamin;
		if (escala > 1) escala = 1;
		
		maxX = parseInt(window.innerWidth / 2);
		maxY = parseInt(window.innerHeight / 2);
		minX = parseInt(window.innerWidth / 2) - (imagem.naturalWidth * escala);
		minY = parseInt(window.innerHeight / 2) - (imagem.naturalHeight * escala);
		
		if (tX > maxX) tX = maxX;
		if (tX < minX) tX = minX;
		if (tY > maxY) tY = maxY;
		if (tY < minY) tY = minY;
		
		ctx.drawImage(imagem, tX, tY, imagem.naturalWidth * escala, imagem.naturalHeight * escala);
		
		var r1 = parseInt(window.innerWidth / 2) - 1 - raio;
		var r2 = parseInt(window.innerHeight / 2) - 1 - raio;
		var r3 = parseInt(window.innerWidth / 2) + 2 + raio;
		var r4 = parseInt(window.innerHeight / 2) + 2 + raio;
		var r5 = 3 + (raio * 2);
		
		ctx.beginPath();
		ctx.moveTo(0, parseInt(window.innerHeight / 2));
		ctx.lineTo(r1 - 1, parseInt(window.innerHeight / 2));
		ctx.moveTo(r3 + 1, parseInt(window.innerHeight / 2));
		ctx.lineTo(window.innerWidth, parseInt(window.innerHeight / 2));
		
		ctx.moveTo(parseInt(window.innerWidth / 2), 0);
		ctx.lineTo(parseInt(window.innerWidth / 2), r2 - 1);
		ctx.moveTo(parseInt(window.innerWidth / 2), r4 + 1);
		ctx.lineTo(parseInt(window.innerWidth / 2), window.innerHeight);
		
		ctx.strokeStyle = '#ff0000';
		ctx.stroke();
		
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(r1, r2, r5, r5);
		
		
		var cor = ctx.getImageData(r1 + 1, r2 + 1, (raio * 2) + 1, (raio * 2) + 1).data;
		
		var rgbm = [0, 0, 0];
		var rgbs = [0, 0, 0];
		
		for (var i = 0; i < cor.length; i += 4) {
			rgbm[0] += cor [i];
			rgbm[1] += cor [i + 1];
			rgbm[2] += cor [i + 2];
			
			rgbs[0] += cor [i] * cor [i];
			rgbs[1] += cor [i + 1] * cor [i + 1];
			rgbs[2] += cor [i + 2] * cor [i + 2];
		}
			
		var pixels = parseInt(cor.length / 4);
		
		
		document.getElementById("rgb1").innerHTML = "RGB(m): " + parseInt(rgbm[0] / pixels) + ", " + parseInt(rgbm[1] / pixels) + ", " + parseInt(rgbm[2] / pixels);
		document.getElementById("crgb1").style.backgroundColor = 'rgb(' + [parseInt(rgbm[0] / pixels), parseInt(rgbm[1] / pixels), parseInt(rgbm[2] / pixels)].join(',') + ')';
		
		document.getElementById("rgb2").innerHTML = "RGB(s): " + parseInt(Math.sqrt(rgbs[0] / pixels)) + ", " + parseInt(Math.sqrt(rgbs[1] / pixels)) + ", " + parseInt(Math.sqrt(rgbs[2] / pixels));
		document.getElementById("crgb2").style.backgroundColor = 'rgb(' + [parseInt(Math.sqrt(rgbs[0] / pixels)), parseInt(Math.sqrt(rgbs[1] / pixels)), parseInt(Math.sqrt(rgbs[2] / pixels))].join(',') + ')';
		
		document.getElementById("raio").innerHTML = raio;
		
		//document.getElementById("log").innerHTML = dist;
		
		var aux = 0;
		aux = - Math.log10(rgbm[0] / 255);
		rc = (- rb * aux) / (ra * (aux - 1));
		aux = - Math.log10(rgbm[1] / 255);
		gc = (- gb * aux) / (ga * (aux - 1));
		aux = - Math.log10(rgbm[2] / 255);
		bc = (- bb * aux) / (ba * (aux - 1));
		
		if (rc < 0) rc = 0;
		if (gc < 0) gc = 0;
		if (bc < 0) bc = 0;
		
		document.getElementById("log").innerHTML = "(" + parseFloat(rc.toFixed(2)) + ", " + parseFloat(gc.toFixed(2))  + ", " + parseFloat(bc.toFixed(2)) + ") mg/L CaCO3";
	}
}

cnv.addEventListener('touchstart', function(e) {
	press = true;
	escalaAtual = escala;
	switch (e.touches.length) {
		case 1: {
			dedos = 1;
			posX = e.changedTouches[0].pageX - this.offsetLeft;
			posY = e.changedTouches[0].pageY - this.offsetTop;
		} break;
		case 2: {
			dedos = 2;
			dist = Math.sqrt((e.touches[1].pageX - e.touches[0].pageX) * (e.touches[1].pageX - e.touches[0].pageX) + (e.touches[1].pageY - e.touches[0].pageY) * (e.touches[1].pageY - e.touches[0].pageY));
			posX = parseInt((e.changedTouches[1].pageX + e.changedTouches[0].pageX) / 2);
			posY = parseInt((e.changedTouches[1].pageY + e.changedTouches[0].pageY) / 2);
			//document.getElementById("log").innerHTML = escalaAtual;
		} break;
		default: break;
	}
});

cnv.addEventListener('touchend', function() {
	press = false;
	dedos = 0;
});

cnv.addEventListener('touchcancel', function() {
	press = false;
	dedos = 0;
});

cnv.addEventListener('touchmove', function(e) {
	if (press && temImagem) {
		switch (e.touches.length) {
			case 1: {
				tX += (e.changedTouches[0].pageX - this.offsetLeft) - posX;
				tY += (e.changedTouches[0].pageY - this.offsetTop) - posY;
				posX = e.changedTouches[0].pageX - this.offsetLeft;
				posY = e.changedTouches[0].pageY - this.offsetTop;
				redraw();
			} break;
			case 2: {
				if (dedos === 2) {
					var deltaT = Math.sqrt((e.touches[1].pageX - e.touches[0].pageX) * (e.touches[1].pageX - e.touches[0].pageX) + (e.touches[1].pageY - e.touches[0].pageY) * (e.touches[1].pageY - e.touches[0].pageY)) / dist;
					escala = escalaAtual * deltaT;
					tX += parseInt((e.changedTouches[1].pageX + e.changedTouches[0].pageX) / 2) - posX;
					tY += parseInt((e.changedTouches[1].pageY + e.changedTouches[0].pageY) / 2) - posY;
					posX = parseInt((e.changedTouches[1].pageX + e.changedTouches[0].pageX) / 2);
					posY = parseInt((e.changedTouches[1].pageY + e.changedTouches[0].pageY) / 2);
					redraw();
				} else {
					dedos = 2;
					dist = Math.sqrt((e.touches[1].pageX - e.touches[0].pageX) * (e.touches[1].pageX - e.touches[0].pageX) + (e.touches[1].pageY - e.touches[0].pageY) * (e.touches[1].pageY - e.touches[0].pageY));
					posX = parseInt((e.changedTouches[1].pageX + e.changedTouches[0].pageX) / 2);
					posY = parseInt((e.changedTouches[1].pageY + e.changedTouches[0].pageY) / 2);
				}
			} break;
			default: break;
		}
	}
});

cnv.addEventListener('mousedown', function(e) {
	press = true;
	posX = e.pageX - this.offsetLeft;
	posY = e.pageY - this.offsetTop;
});

cnv.addEventListener('mouseup', function() {
	press = false;
});

cnv.addEventListener('mouseout', function() {
	press = false;
});

cnv.addEventListener('mousemove', function(e) {
	if (press) {
		tX += (e.pageX - this.offsetLeft) - posX;
		tY += (e.pageY - this.offsetTop) - posY;
		posX = e.pageX - this.offsetLeft;
		posY = e.pageY - this.offsetTop;
		redraw();
	}
});

cnv.addEventListener('wheel', function(e) {
	if (temImagem) {
		escala += e.deltaY * escalamult;
		redraw();
	}
});

document.getElementById("reduzir").addEventListener('click', function() {
	raio --;
	if (raio < 0) raio = 0;
	redraw();
});

document.getElementById("reduzir").addEventListener('touchend', function() {
	raio --;
	if (raio < 0) raio = 0;
	redraw();
});

document.getElementById("aumentar").addEventListener('click', function() {
	raio ++;
	if (raio > 100) raio = 100;
	redraw();
});

document.getElementById("aumentar").addEventListener('touchend', function() {
	raio ++;
	if (raio > 100) raio = 100;
	redraw();
});
  
/* canvas.addEventListener('click', function(e) {
	posx = e.pageX - this.offsetLeft;
	posy = e.pageY - this.offsetTop;
	rgb = ctx.getImageData(posx, posy, 1, 1).data;
	r = rgb[0];
	g = rgb[1];
	b = rgb[2];
	alert(r + ', ' + g + ', ' + b);
});

canvas.addEventListener('touchstart', function() {
	inicio = Date.now();
});
  
canvas.addEventListener('touchend', function(e) {
	if (Date.now() - inicio < 300) {
		posx = e.changedTouches[0].pageX - this.offsetLeft;
		posy = e.changedTouches[0].pageY - this.offsetTop;
		rgb = ctx.getImageData(posx, posy, 1, 1).data;
		r = rgb[0];
		g = rgb[1];
		b = rgb[2];
		alert(r + ', ' + g + ', ' + b);
	}
}); */
