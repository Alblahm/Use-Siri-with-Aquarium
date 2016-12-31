var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var err = null; // in case there were any problems
var wget = require('node-wget');
var request = require('request');

// here's a fake hardware device that we'll expose to HomeKit   
var FAKE_OUTLET = {
  powerOn: false,

  setPowerOn: function(onValue) { 
    //console.log("Filtro: %s!", onValue ? "on" : "off");
    var error = null;
    FAKE_OUTLET.powerOn = onValue;
    if ( onValue == 1 ) {
	FAKE_OUTLET.sendQuery("http://192.168.1.10/arduino/digital/10/1","Fallo la conexion con Arduino Yun (WRITE FA)","Encendiendo filtro del acuario!");
    } else {
	FAKE_OUTLET.sendQuery("http://192.168.1.10/arduino/digital/10/0","Fallo la conexion con Arduino Yun (WRITE FA)","Apagando filtro del acuario!");
    }
  },
  sendQuery: function(urlInfo,errorInfo,logInfo){
     request({
	method: 'GET'
	,url: urlInfo
	,dry: true
     },
     function (error, response, body) {
	if( error !== null) {
	   console.log('->. ' + errorInfo + ' ' + error);
	} else {
	   //console.log(body);
	   console.log("... " + logInfo);
	}
     });
  },
  identify: function() {
     console.log("Identify the outlet.");
  }
}

// Generate a consistent UUID for our outlet Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the accessory name.
var outletUUID = uuid.generate('hap-nodejs:accessories:OutletFiltroAcuario');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var outlet = exports.accessory = new Accessory('Outlet', outletUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
outlet.username = "C7:1A:3E:1C:5A:C2";
outlet.pincode = "031-45-154";

// set some basic properties (these values are arbitrary and setting them is optional)
outlet
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "RENA CO")
  .setCharacteristic(Characteristic.Model, "Filtro Acuario")
  .setCharacteristic(Characteristic.SerialNumber, "A1S2NASF88EW");

// listen for the "identify" event for this Accessory
outlet.on('identify', function(paired, callback) {
  FAKE_OUTLET.identify();
  callback(); // success
  });

// Add the actual outlet Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
outlet
  .addService(Service.Outlet, "Filtro") // services exposed to the user should have "names" like "Fake Light" for us
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    FAKE_OUTLET.setPowerOn(value);
    callback(); // Our fake Outlet is synchronous - this value has been successfully set
  });

// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
outlet
  .getService(Service.Outlet)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {

    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.
    var error = null; // in case there were any problems
    request(
       { method:'GET'
         ,uri:'http://192.168.1.10/data/get/D10'
         ,json: true
         ,timeout:1500
       }
       , function(error, response, body) {
	   if ( error !== null) {
		console.log("->. Fallo la conexion con Arduino Yun (READ FA) " + error);
		callback(error);
	   } else {
		//console.log(".   Respuesta de Filtro: " + response);
                var TextoResp =  JSON.stringify(response.body);
                var JSONobject = JSON.parse(TextoResp);
	        //console.log("Info de la consulta: " + TextoResp); 

		// En funcion del campo valor se devuelve el estado. La respuesta debería ser del tipo:
		// {"value":"0","key":"D10","response":"get"} ...
		if ((parseInt(JSONobject.value) == 1) && (JSONobject.key == "D10")) {
               		console.log("... Estaba encendido el filtro del Acuario? Si.");
			FAKE_OUTLET.powerOn = true;
                        callback(error, true);
      		} else if ((parseInt(JSONobject.value) == 0) && (JSONobject.key == "D10")) {
                	console.log("... Estaba encendido el filtro del Acuario? No.");
			FAKE_OUTLET.powerOn = false;
                     	callback(error, false);
      		} else if ((JSONobject.value == undefined) && (JSONobject.key == "D10")) {
                	console.log("->. Fallo en la consulta Rapida (READ FA)");
			FAKE_OUTLET.sendQuery("http://192.168.1.10/arduino/digital/10","Fallo la conexion con Arduino Yun (WRITE FA)","Consultando filtro del acuario!");
			//console.log(body);
                     	callback(new Error("Consulta mediante REST no disponible"));
       		} else {
			console.log("->. Fallo en la consulta (READ FA)");
			//console.log(response);
			console.log(body);
			callback(new Error("Error de Solape de consultas"));
		}
         }
      }
      )
  }); 
