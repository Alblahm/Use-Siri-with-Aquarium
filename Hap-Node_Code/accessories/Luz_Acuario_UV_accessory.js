var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var wget = require('node-wget');
var Request = require('delayed-request')(require('request'));

var request = new Request({
    debug: false, // Optional, output delay to console  
    delayMin: 670,
    delayMax: 990
});

// here's a fake hardware device that we'll expose to HomeKit  
var FAKE_LIGHT = {
  powerOn: false,
  
  setPowerOn: function(onValue) { 
    //console.log("Luz UV: %s!", onValue ? "on" : "off");
    var error = null;
    FAKE_LIGHT.powerOn = onValue;
    if ( onValue == 1 ) {
	FAKE_LIGHT.sendQuery("http://192.168.1.10/arduino/digital/13/1","Fallo la conexion con Arduino Yun (WRITE UV)","Encendiendo luz UV del acuario!");
    } else {
	FAKE_LIGHT.sendQuery("http://192.168.1.10/arduino/digital/13/0","Fallo la conexion con Arduino Yun (WRITE UV)","Apagando luz UV del acuario!");
    }
  },
  sendQuery: function(urlInfo,errorInfo,logInfo){
     request.run({
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
    console.log("Identify the light!");
  }
}

// Generate a consistent UUID for our light Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the last word.
var lightUUID = uuid.generate('hap-nodejs:accessories:lightUVAcuario');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var light = exports.accessory = new Accessory('Light', lightUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
light.username = "C7:1A:3E:1C:5A:AE";
light.pincode = "031-45-154";

// set some basic properties (these values are arbitrary and setting them is optional)
light
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "MAGNETEK")
  .setCharacteristic(Characteristic.Model, "D468-16-2K3")
  .setCharacteristic(Characteristic.SerialNumber, "097");

// listen for the "identify" event for this Accessory
light
   .on('identify', function(paired, callback) {
     FAKE_LIGHT.identify();
     callback(); // success
    });

// Add the actual Lightbulb Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
light
  .addService(Service.Lightbulb, "Lámpara Ultra Violeta")
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    FAKE_LIGHT.setPowerOn(value);
    callback(); // Our fake Light is synchronous - this value has been successfully set
  });

// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
light
  .getService(Service.Lightbulb)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {
    
    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.
    
    var error = null; // in case there were any problems
    request.run(
       { method:'GET'
         ,uri:'http://192.168.1.10/data/get/D13'
         ,json: true
         ,timeout:1500
       }
       , function(error, response, body) {
	   if ( error !== null) {
		console.log("->. Fallo la conexion con Arduino Yun (READ UV) " + error);
		callback(error);
	   } else {
                //console.log(".   Respuesta de UV: " + response);
		var TextoResp =  JSON.stringify(response.body);
                var JSONobject = JSON.parse(TextoResp);
	        //console.log("Info de la consulta: " + TextoResp); 

		// En funcion del campo valor se devuelve el estado. La respuesta debería ser del tipo:
		// {"value":"0","key":"D13","response":"get"} ...
		if ((parseInt(JSONobject.value) == 1) && (JSONobject.key == "D13")) {
               		console.log("... Estaba encendida la luz UV del Acuario? Si.");
			FAKE_LIGHT.powerOn = true;
                        callback(error, true);
      		} else if ((parseInt(JSONobject.value) == 0) && (JSONobject.key == "D13")) {
                	console.log("... Estaba encendida la luz UV del Acuario? No.");
			FAKE_LIGHT.powerOn = false;
                     	callback(error, false);
      		} else if ((JSONobject.value == undefined) && (JSONobject.key == "D13")) {
                	console.log("->. Fallo en la consulta Rapida (READ UV)");
			FAKE_LIGHT.sendQuery("http://192.168.1.10/arduino/digital/13","Fallo la conexion con Arduino Yun (WRITE LF)","Consultando luz UV del acuario!");
			//console.log(body);
                     	callback(new Error("Consulta mediante REST no disponible"));
       		} else {
			console.log("->. Fallo en la consulta (READ UV)");
			//console.log(response);
			console.log(body);
			callback(new Error("Error de Solape de consultas"));
		}
           }
      }
      )
  });
