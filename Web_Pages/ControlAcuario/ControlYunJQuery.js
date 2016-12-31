/*!
 *
 * Copyright 2016,
 *
 * Date: Wed Feb 23 2016 -0500
 */

var myVar;
var myVarG;
var iterLOOP=0;
var firstLoad=1;
var jq = $.noConflict();
jq(document).ready(function(){
    jq("img").click(function(){
	var fObjThis=jq(this);
	var txtAlt=fObjThis.attr("alt");
	var tipoIm=fObjThis.attr("name").split("_");
	// Para responder a los eventos de los controles de los pines digitales
	if(tipoIm[0]=="tagIO"){
		var idCtrl=parseInt(tipoIm[1]);
		fObjThis.fadeOut(1600);
		if(txtAlt == "OFF"){
			jq.get('/arduino/digital/'+idCtrl+'/1', function (data,status) {
				//alert("Data: " + data + "\nStatus: " + status);
				fObjThis.fadeOut(400,function(){fObjThis.attr("src", "Botton_ON.jpg").fadeIn("slow");});
				fObjThis.attr("alt", "ON");
			}).fail(function() {
				fObjThis.fadeOut(1000,function(){fObjThis.attr("src", "Botton_Broken.jpg");fObjThis.fadeIn("slow");});
  			});
		}else{
			jq.get('/arduino/digital/'+idCtrl+'/0', function(data,status) {
				//alert("Data: " + data + "\nStatus: " + status);
				fObjThis.fadeOut(400,function(){fObjThis.attr("src", "Botton_OFF.jpg").fadeIn("slow");});
				fObjThis.attr("alt", "OFF");
			}).fail(function() {
				fObjThis.fadeOut(1000,function(){fObjThis.attr("src", "Botton_Broken.jpg");fObjThis.fadeIn("slow");});
  			});
		}
	// Para responder a los eventos del control del estado de escritura en la SD...
	}else if(tipoIm[0]=="tagLogIm"){
		fObjThis.fadeOut(2000);
		if(txtAlt == "OFF"){
			jq.get('/arduino/log/1', function (data,status) {
				fObjThis.fadeOut(200,function(){fObjThis.attr("src", "Botton_Ok_Azul.jpg").fadeIn("slow");});
				fObjThis.attr("alt", "ON");
			}).fail(function() {
				fObjThis.fadeOut(1000,function(){fObjThis.attr("src", "Botton_Broken_O.jpg");fObjThis.fadeIn("slow");});
  			});
		}else{
			jq.get('/arduino/log/0', function(data,status) {
				fObjThis.fadeOut(200,function(){fObjThis.attr("src", "Botton_X_Rojo.jpg").fadeIn("slow");});
				fObjThis.attr("alt", "OFF");
			}).fail(function() {
				fObjThis.fadeOut(1000,function(){fObjThis.attr("src", "Botton_Broken_O.jpg");fObjThis.fadeIn("slow");});
  			});
		}
	// Para responder a los eventos del control del estado de la Wifi...
	}else if(tipoIm[0]=="tagWifi"){
		fObjThis.fadeOut(2000);
		if(txtAlt == "OFF"){
			fObjThis.fadeOut(200,function(){fObjThis.attr("src", "Wifi_ON.gif").fadeIn("slow");});
			fObjThis.attr("alt", "ON");
			jq.get('/arduino/wifi/1', function (data,status) {
			}).fail(function() {
				//fObjThis.fadeOut(1000,function(){fObjThis.attr("src", "Wifi_Err.gif");fObjThis.fadeIn("slow");});
  			});
		}else{
			fObjThis.fadeOut(200,function(){fObjThis.attr("src", "Wifi_OFF.gif").fadeIn("slow");});
			fObjThis.attr("alt", "OFF");
			jq.get('/arduino/wifi/0', function(data,status) {
			}).fail(function() {
				//fObjThis.fadeOut(1000,function(){fObjThis.attr("src", "Wifi_Err.gif");fObjThis.fadeIn("slow");});
  			});
		}
	// Para responder a los eventos de información del estado de la comida...
	}else if(tipoIm[0]=="tagMeal"){
		fObjThis.fadeOut(2000);
		if(txtAlt == "VACIO"){
			fObjThis.fadeOut(200,function(){fObjThis.attr("src", "Meal_Blue.png").fadeIn("slow");});
			fObjThis.attr("alt", "LLENO");
			jq.get('/arduino/endfood', function (data,status) {
			}).fail(function() {
				//fObjThis.fadeOut(1000,function(){fObjThis.attr("src", "Meal_Err.png");fObjThis.fadeIn("slow");});
  			});
		}else{
			fObjThis.fadeOut(200,function(){fObjThis.attr("src", "Meal_Vacio.png").fadeIn("slow");});
			fObjThis.attr("alt", "VACIO");
			jq.get('/arduino/endfood', function(data,status) {
			}).fail(function() {
				//fObjThis.fadeOut(1000,function(){fObjThis.attr("src", "Meal_Err.png");fObjThis.fadeIn("slow");});
  			});
		}
	// Para obtener la información acerca de la app ...
	}else if(tipoIm[0]=="tagInfo"){
		// Información de la aplicación ...
		alert('Este Script utiliza jQuery con json \npara acelerar la lectura del estado\nde los pines digitales!','Alert Dialog');
	}
    });
    jq("A").click(function(){
	var fObjThis=jq(this);
	var tipoLink=fObjThis.attr("name");
	// Para responder a los eventos de los controles de los pines digitales
	if(tipoLink=="tagLastEat"){
	  //console.log("Pulsado hipervinculo eat");
	  CheckLastEat(jq("[name='tagLastEat']"));
	}else if(tipoLink=="tagTemp"){
	  //console.log("Pulsado hipervinculo temp");
	  CheckLastTemp(jq("[name='tagTemp']"));
	}
    });
});


// Funcion creada para que los hipervínculos apunten a algo, si se deja vacio el campo href entonces recarga la pagina de nuevo. Y
// si no se crea el hipervínculo, no cambia la forma del raton al pasar sobre el control. Por eso se crea un hipervinculo vacio.
function doNot() {};


// Para actualizar los controles de pantalla con los valores reales de los pines, y la primera vez que se carga la pagina.
// Al cargar el valor rápido mediante rest, a veces se lian las consultas y devuelve un valor que no se corresponde a la 
// clave solicitada, en esos casos se hace la consulta lenta directa al Yun en lugar de preguntar al linino.
function checkAll() {
	iterLOOP=0;
	clearTimeout(myVar);
	// Se comprueba si ha habido algún cambio desde la ultima actualización ...
	CheckControlsState();
	clearTimeout(myVarG);
	myVarG = setInterval(CheckControlsState, 10000);
};


// Comprueba si ha habido alguna actualización reciente y si la hubo se actualizan los controles de pantalla ...
function CheckControlsState() {
	iterLOOP=0;
	jq.getJSON('/data/get/CambiosRec', function(dataFast,status) {
		if ((dataFast["value"] != null) && (dataFast["key"]=="CambiosRec")) {
			// Además se actualiza el estado de la var local con la info de actualización ... 
			if(parseInt(dataFast["value"])==1){
				// Si es necesario actualizar se comprueban todas las E/S ...
				myVar = setInterval(checkOnebyOne, 400);
				jq.get('/arduino/changes/0');
				//console.log("Valor Rapido 1");
				firstLoad=0;
			}else{
				// Si es necesario actualizar se comprueban todas las E/S ...
				if(firstLoad==1){myVar = setInterval(checkOnebyOne, 400);}
				//console.log("Valor Rapido 0");
				firstLoad=0;
			}
		}else{
			jq.get('/arduino/changes', function (dataSlow,status) {
				// Además se actualiza el estado de la var local con la info de actualización ...
				var response = dataSlow.split(" ");
				if(parseInt(response[1])==1){
					// Si es necesario actualizar se comprueban todas las E/S ...
					myVar = setInterval(checkOnebyOne, 400);
					jq.get('/arduino/changes/0');
					//console.log("Valor lento 1");
					firstLoad=0;
				}else{
					// Si es necesario actualizar se comprueban todas las E/S ...
					if(firstLoad==1){myVar = setInterval(checkOnebyOne, 400);}
					//console.log("Valor lento 0");
					firstLoad=0;
				}
			}).fail(function() {
				firstLoad=1;
  			});
		}
	}).fail(function() {
		estadoUPD=1;
  	});
};


// Esta función se llama de modo programado realizando una secuencia de actualizaciones de los controles de uno en uno
// cada medio seg. de este modo las respuestas rest no dan valores errorenos por hacer peticiones demasiado juntas.
function checkOnebyOne() {
	var i;
	var sNControl;
	var pinOrder=[8,9,10,13];
	if(iterLOOP>=pinOrder.length){
		// Tras la ultima iteración se actualiza el estado del log, la temperatura y la fecha de rellenado de comida ...
		if(iterLOOP==pinOrder.length){
		  CheckLogState(jq("[name='tagLogIm']"));
		}else if(iterLOOP==(pinOrder.length+1)){
		  CheckLastTemp(jq("[name='tagTemp']"));
		}else{
		  CheckLastEat(jq("[name='tagLastEat']"));
		  clearTimeout(myVar);
		  iterLOOP=0;
		}
	}else{
	   if(pinOrder[iterLOOP]<=9){sNControl='tagIO_0'+pinOrder[iterLOOP];}else{sNControl='tagIO_'+pinOrder[iterLOOP];}
	   ckeckPin(pinOrder[iterLOOP],jq("[name='"+sNControl+"']"));
	}
	iterLOOP=iterLOOP+1;
}


// Lectura del valor actual el pin N mediante json y si no funciona directamente al arduino.
function ckeckPin(idCtrl,fObjSelect) {
	fObjSelect.fadeOut(4200);
	//console.log("Intentando Valor rapido de " + idCtrl);
	jq.getJSON('/data/get/D'+parseInt(idCtrl), function(dataFast,status) {
		var nKey=Number(dataFast["key"].slice(1));
		//console.log("Valor rapido de " + idCtrl + " leido(" + dataFast["value"] + ") Id: " + nKey );
		if ((dataFast["value"] != null) && (nKey==parseInt(idCtrl))) {
			//console.log("Valor rapido de " + idCtrl + " leido(" + dataFast["value"] + ") Id: " + dataFast["key"] );
			if(parseInt(dataFast["value"])==1){
				//console.log("Fijando ON ");
				fObjSelect.fadeOut("slow",function(){fObjSelect.attr("src", "Botton_ON.jpg");fObjSelect.fadeIn("slow")});
				fObjSelect.attr("alt", "ON");
			}else{
				//console.log("Fijando OFF ");
				fObjSelect.fadeOut("slow",function(){fObjSelect.attr("src", "Botton_OFF.jpg");fObjSelect.fadeIn("slow")});
				fObjSelect.attr("alt", "OFF");
			}
		}else{
			//console.log("Intentando Valor lento de " + idCtrl);
			jq.get('/arduino/digital/'+parseInt(idCtrl), function (dataSlow,status) {
				//console.log("Valor lento leido "+ dataSlow);
				var response = dataSlow.split(" ");
				if(parseInt(response[4])==1){
					//console.log("Fijando ON ");
					fObjSelect.fadeOut("slow",function(){fObjSelect.attr("src", "Botton_ON.jpg");fObjSelect.fadeIn("slow")});
					fObjSelect.attr("alt", "ON");
				}else{
					//console.log("Fijando OFF ");
					fObjSelect.fadeOut("slow",function(){fObjSelect.attr("src", "Botton_OFF.jpg");fObjSelect.fadeIn("slow")});
					fObjSelect.attr("alt", "OFF");
				}
			}).fail(function() {
				//console.log("Fallo al leer el valor lento. Error de conexión ");
				fObjSelect.fadeOut(1000,function(){fObjSelect.attr("src", "Botton_Broken.jpg");fObjSelect.fadeIn("slow");});
  			});
		}
	}).fail(function() {
		//console.log("Fallo al leer el valor rápido. Error de conexión ");
		fObjSelect.fadeOut(1000,function(){fObjSelect.attr("src", "Botton_Broken.jpg");fObjSelect.fadeIn("slow");});
  	});
};


// Comprueba el estado de lectura/escritura del archivo de Log ...
function CheckLogState(fObjSelect) {
	fObjSelect.fadeOut(4200);
	//console.log("Intentando Valor rapido de " + idCtrl);
	jq.getJSON('/data/get/Log', function(dataFast,status) {
		if (dataFast["value"] != null && (dataFast["key"]=="Log")) {
			//console.log("Valor rapido de " + idCtrl + " leido(" + dataFast["value"] + ") Id: ");
			if(parseInt(dataFast["value"])==1){
				//console.log("Leido ON ");
				fObjSelect.fadeOut("slow",function(){fObjSelect.attr("src", "Botton_Ok_Azul.jpg");fObjSelect.fadeIn("slow")});
				fObjSelect.attr("alt", "ON");
			}else{
				//console.log("Leido OFF ");
				fObjSelect.fadeOut("slow",function(){fObjSelect.attr("src", "Botton_X_Rojo.jpg");fObjSelect.fadeIn("slow")});
				fObjSelect.attr("alt", "OFF");
			}
		}else{
			//console.log("Intentando Valor lento de " + idCtrl);
			jq.get('/arduino/log', function (dataSlow,status) {
				//console.log("Valor lento leido "+ dataSlow);
				var response = dataSlow.split(" ");
				if(parseInt(response[1])==1){
					//console.log("Leido Log ON ");
					fObjSelect.fadeOut("slow",function(){fObjSelect.attr("src", "Botton_Ok_Azul.jpg");fObjSelect.fadeIn("slow")});
					fObjSelect.attr("alt", "ON");
				}else{
					//console.log("Leido Log OFF ");
					fObjSelect.fadeOut("slow",function(){fObjSelect.attr("src", "Botton_X_Rojo.jpg");fObjSelect.fadeIn("slow")});
					fObjSelect.attr("alt", "OFF");
				}
			}).fail(function() {
				//console.log("Fallo al leer el valor lento. Error de conexión ");
				fObjSelect.fadeOut(1000,function(){fObjSelect.attr("src", "Botton_Broken_O.jpg");fObjSelect.fadeIn("slow");});
  			});
		}
	}).fail(function() {
		//console.log("Fallo al leer el valor rápido. Error de conexión ");
		fObjSelect.fadeOut(1000,function(){fObjSelect.attr("src", "Botton_Broken_O.jpg");fObjSelect.fadeIn("slow");});
  	});
};

// Comprueba la fecha de la ultima pulsación del boton de reset de la comida ...
function CheckLastEat(fObjSelect) {
	fObjSelect.fadeOut(4200);
	var msAhora=Date.now();
	//console.log("Intentando Valor rapido ");
	jq.getJSON('/data/get/LastRefill', function(dataFast,status) {
		if (dataFast["value"] != null && (dataFast["key"]=="LastRefill")) {
			//console.log("Valor rapido leido:" + dataFast["value"]);
			var respData = dataFast["value"].split(",");
			var dayParts = respData[0].split("-");
			var fechaFood = new Date(dayParts[1]+"/"+dayParts[0]+"/"+dayParts[2]+" "+respData[1]);
			var msecFood = Date.parse(fechaFood);
			var hourDiff = (msAhora-msecFood)/(3600*1000);
			var dayDiff = parseInt(hourDiff/24);
			var textDiff;
			if(hourDiff<2){
				textDiff="hace 1 Hora";
			}else if(hourDiff<24){
				textDiff="hace "+ parseInt(hourDiff) + " Horas";
			}else if(dayDiff==1){
				textDiff="hace 1 D&iacute;a";
			}else{
				textDiff="hace "+ dayDiff + " D&iacute;as";
			}

			fObjSelect.fadeOut("slow",function(){fObjSelect.html(textDiff);fObjSelect.fadeIn("slow")});
		}else{
			//console.log("Intentando Valor lento");
			jq.get('/arduino/foodtime', function (dataSlow,status) {
				console.log("Valor lento leido "+ dataSlow);
				var respString = dataSlow.split(" ");
				var respData = respString[0].split(",");
				var dayParts = respData[0].split("-");
				var fechaFood = new Date(dayParts[1]+"/"+dayParts[0]+"/"+dayParts[2]+" "+respData[1]);
				var msecFood = Date.parse(fechaFood);
				var hourDiff = (msAhora-msecFood)/(3600*1000);
				var dayDiff = parseInt(hourDiff/24);
				var textDiff;
				if(hourDiff<2){
					textDiff="hace 1 Hora";
				}else if(hourDiff<24){
					textDiff="hace "+ parseInt(hourDiff) + " Horas";
				}else if(dayDiff==1){
					textDiff="hace 1 D&iacute;a";
				}else{
					textDiff="hace "+ dayDiff + " D&iacute;as";
				}

				fObjSelect.fadeOut("slow",function(){fObjSelect.html(textDiff);fObjSelect.fadeIn("slow")});

			}).fail(function() {
				//console.log("Fallo al leer el valor lento. Error de conexión ");
				fObjSelect.fadeOut(1000,function(){fObjSelect.html("? D&iacute;as");fObjSelect.fadeIn("slow");});
  			});
		}
	}).fail(function() {
		//console.log("Fallo al leer el valor rápido. Error de conexión ");
		fObjSelect.fadeOut(1000,function(){fObjSelect.html("? D&iacute;as");fObjSelect.fadeIn("slow");});
  	});
};

// Comprueba la ultima temperatura leida del acuario ...
function CheckLastTemp(fObjSelect) {
	fObjSelect.fadeOut(4200);
	//console.log("Intentando Valor rapido ");
	jq.getJSON('/data/get/Temp', function(dataFast,status) {
		if (dataFast["value"] != null && (dataFast["key"]=="Temp")) {
			//console.log("Valor rapido de leido:" + parseInt(dataFast["value"]));
			var convTemp=parseInt(dataFast["value"])-73;
			fObjSelect.fadeOut("slow",function(){fObjSelect.html(convTemp+"&deg;C");fObjSelect.fadeIn("slow")});
		}else{
			//console.log("Intentando Valor lento");
			jq.get('/arduino/Temp', function (dataSlow,status) {
				//console.log("Valor lento leido "+ dataSlow);
				var response = dataSlow.split(" ");
				var convTemp=parseInt(response[1])-73;
				fObjSelect.fadeOut("slow",function(){fObjSelect.html(convTemp+"&deg;C");fObjSelect.fadeIn("slow")});
			}).fail(function() {
				//console.log("Fallo al leer el valor lento. Error de conexión ");
				fObjSelect.fadeOut(1000,function(){fObjSelect.html("?? &deg;C");fObjSelect.fadeIn("slow");});
  			});
		}
	}).fail(function() {
		//console.log("Fallo al leer el valor rápido. Error de conexión ");
		fObjSelect.fadeOut(1000,function(){fObjSelect.html("?? &deg;C");fObjSelect.fadeIn("slow");});
  	});
};

/*!


			console.log("Intentando Valor lento");
			jq.get('/arduino/Temp', function (dataSlow,status) {
				console.log("Valor lento leido "+ dataSlow);
				var response = dataSlow.split(" ");
				var convTemp=parseInt(response[1])+73;
				fObjSelect.fadeOut("slow",function(){fObjSelect.html(convTemp+"&deg;C");fObjSelect.fadeIn("slow")});
			}).fail(function() {
				console.log("Fallo al leer el valor lento. Error de conexión ");
				fObjSelect.fadeOut(1000,function(){fObjSelect.html("?? &deg;C");fObjSelect.fadeIn("slow");});
  			});

 */

