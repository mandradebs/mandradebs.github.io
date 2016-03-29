/*
  Este script contiene el código para el juego memorama
  Autor: Marco Antonio Andrade Barrera
  Materia: Lenguajes de Internet
  Grupo: 8cv11
  Instituto Politécnico Nacional
  Escuela Superior de Ingeniería Mecánica y Eléctrica
  Ingeniería en Comunicaciones y Electrónica
  Fecha: Marzo de 2016
  
  las imagenes utilizadas se pueden descargar de manera gratuita desde
  el conjunto de iconos Crystal Clear en el sitio https://commons.wikimedia.org/wiki/Crystal_Clear
 */

var nImg = 40; //Total de imagenes a mostrar en el memorama

//función para revolver un array tomada de http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var parGenerales = {
		imgAbiertas: 0,//número de imagenes destapadas
		imgAbierta1: document,
		imgAbierta2: document,
		imagenes: [],
		memorama: [],
		imagenesDescubiertas: [],
		coincidencia: function(){
			if(this.imgAbierta1.src == this.imgAbierta2.src){//verificar si las imagenes descubiertas son pares								
				return true;
			}
			else{				
				return false;
			}
		},
		reset: function(){
			this.imgAbiertas = 0;
			this.imgAbierta1 = document;
			this.imgAbierta2 = document;
			this.imagenes = [];//lista de imagenes (indices) para revolver en el memorama
			this.memorama = [];//lista que contiene los pares de imagenes revueltos
			this.imagenesDescubiertas = [];
			for(i=0;i<nImg/2;i++){//se divide entre dos porque siempre habrá cuando menos un par de una misma img en el memorama
				r = Math.random();
				for(j=0; j<2; j++)
					this.imagenes.push(Math.round((imgActual.lista.length-1) * r))
					//en este punto la lista de imagenes es por ejemplo
					//[5,5,12,12,40,40,4,4,0,0,...] en seguida se asigna esta lista
					//al memorama pero se revuelven las imagenes
			}
			this.memorama = shuffleArray(this.imagenes);
		}
};

//conjuntos de imagenes, que aparecerán como opciones en el menú
//el nombre es tal como aparecerá en las opciones
//la ruta es la ruta relativa en donde se encuentra el conjunto de imagenes correspondiente
var img = {
	nombres: ["Acciones","Aplicaciones","Dispositivos","Archivos","Extensiones"],
	prefijo: ["a","ap","d","f","m"],
	totalPorNombre: [80,288,29,35,82],
	rutas: ["img/png/actions",
	        "img/png/apps",
	        "img/png/devices",
	        "img/png/filesystems",
	        "img/png/minetypes"],
	n: function(){return this.nombres.length;}//regresa el número de conjuntos
};

//objeto que contiene el conjunto de imagenes actual, de acuerdo a la opción
//seleccionada
var imgActual = {		
		lista: [],		
		fijarLista: function(indice){
			this.lista = [];
			for(i=1; i<=img.totalPorNombre[indice]; i++){
				this.lista.push(img.rutas[indice] + '/' + img.prefijo[indice] + ' (' + i + ').png');
			}
		}	
};

//regresa un string html con las opciones que aparecen en el menú, dentro del div con
//id="menu"
function menuOpciones() {
	res = "";
	for(i=0; i<img.n(); i++){
		res += "<span id='m" + i + "' class='opcion' onclick='clickOpcion(" + i + ");'>" + img.nombres[i] + "</span>";
	}
	return res;
};

//llenar el área de juego con imagenes desconocidas
function AreaDeJuegoDesconocida(){	
	res = "";
	for(j=0; j<nImg; j++){					
			res += "<img id='img" + j + "' src='img/question.gif' onclick='imgClick(" + j + ");'>";		
	}
	return res;
};

//objeto con las variables de estado del juego
//tiempo transcurrido
//Imagenes descubiertas
//Imagines por descubrir
var estado = {
		segs: 0,
		mins: 0,
		hrs: 0,
		dias: 0,
		incremento: 1,
		tiempoTranscurrido: function(){			
			res = "";			
			if(estado.segs == 60){
				estado.mins++;
				estado.segs = 0;
			}
			if(estado.mins == 60){
				estado.hrs++;
				estado.mins = 0;
			}
			if(estado.hrs == 24){
				estado.dias++;
				estado.hrs = 0;
			}
			
			//poner el tiempo transcurrido en res
			res = ':' + ((estado.segs<10) ? '0' + estado.segs : estado.segs) + res;
			res = ':' + ((estado.mins<10) ? '0' + estado.mins : estado.mins) + res;
			res = ':' + ((estado.hrs<10) ? '0' + estado.hrs : estado.hrs) + res;
			res = ((estado.dias<10) ? '0' + estado.dias : estado.dias) + res;
			document.getElementById("tiempo").innerHTML = res;
			document.getElementById("imagenesDescubiertas").innerHTML = parGenerales.imagenesDescubiertas.length +
			' de ' + parGenerales.memorama.length;
			
			if(parGenerales.memorama.length == parGenerales.imagenesDescubiertas.length)
				estado.incremento = 0;
			
			estado.segs = estado.segs + estado.incremento;
		},
		reinicio: function(){
			estado.segs = 0;
			estado.mins = 0;
			estado.hrs = 0;
			estado.dias = 0;
			estado.incremento = 1;
		}
};

//función asociada al evento click en cada una de las opciones del menu 
function clickOpcion(indice){	
	//Llenar área de juego con imagenes desconocidas
	document.getElementById("areaDeJuego").innerHTML = AreaDeJuegoDesconocida();
	
	//fijar conjunto de imagenes
	imgActual.fijarLista(indice);	
	
	//reiniciamos parámetros generales
	parGenerales.reset();
	
	//reiniciamos status
	estado.reinicio();
};

//función asociada al evento click en cada una de las imagenes del memorama
function imgClick(indice){
	var imagen = document.getElementById("img" + indice);//imagen sobre la que se hiz click
	
	//verificar si la img sobre la que se hizo click no está abierta o descubierta
	if(parGenerales.imagenesDescubiertas.indexOf("img" + indice) > -1)
		return
	if(parGenerales.imgAbiertas == 1){
		if(parGenerales.imgAbierta1.id == imagen.id)
			return
	}
	if(parGenerales.imgAbiertas == 2){
		if(parGenerales.imgAbierta1.id == imagen.id || parGenerales.imgAbierta2.id == imagen.id)
			return
	}	
	
	//si no hay imagenes abiertas, sólo se descubre la del click 
	if(parGenerales.imgAbiertas == 0){
		parGenerales.imgAbierta1 = imagen;
		parGenerales.imgAbiertas++;
		imagen.src = imgActual.lista[parGenerales.memorama[indice]];
	}
	//ya se tiene una imagen abierta
	else if(parGenerales.imgAbiertas == 1){
		parGenerales.imgAbierta2 = imagen;
		parGenerales.imgAbiertas++;
		imagen.src = imgActual.lista[parGenerales.memorama[indice]];		
		if(parGenerales.coincidencia()){//si ambas imagenes abiertas son iguales entonces las dejamos descubiertas
			parGenerales.imgAbiertas = 0;
			parGenerales.imagenesDescubiertas.push(parGenerales.imgAbierta1.id);
			parGenerales.imagenesDescubiertas.push(parGenerales.imgAbierta2.id);
		}
	}
	//hay dos imagenes abiertas
	else{		
		parGenerales.imgAbierta1.src = 'img/question.gif';
		parGenerales.imgAbierta2.src = 'img/question.gif';
		parGenerales.imgAbiertas = 0;
		imgClick(indice);
	}
};

//función principal
function main(){
	//Llenar opciones de menu
	document.getElementById('menu').innerHTML = menuOpciones();
	
	//iniciamos con el conjunto de imagenes ACCIONES
	clickOpcion(0);
	
	//iniciamos status	
	estado.reinicio();
	setInterval(estado.tiempoTranscurrido, 1000);
};

//arranca el programa
main();