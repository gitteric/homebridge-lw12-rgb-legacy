var Service, Characteristic;

module.exports = function (homebridge){
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	UUIDGen = homebridge.hap.uuid;
	homebridge.registerAccessory('homebridge-lw12-legacy', 'lw12-rgb', ControllerAccessory)
}

function ControllerAccessory(log, config) {
	this.log = log;
	this.host = config['host'];
	this.name = config['name'];
	this.port = config['port'];
	this.debug = config['debug'];
	this.verifyConfig();
	
	this.stripe = require('./lw12.js')(this.host, this.port, this.debug);
	
}

ControllerAccessory.prototype = {
	
	verifyConfig: function() {
		if (!this.host || !this.name){
			this.log.error('Please define name and host in config.json');
		}
		if (!this.port) this.port = 5000;
		if (!this.debug) this.debug = false;
	},
	
	identify: function(callback){
		if (this.debug === true) this.log('Identify requested!');
		callback();
	},
	
	getServices: function() {
		
		var informationService = new Service.AccessoryInformation();
		
		informationService
			.setCharacteristic(Characteristic.Manufacturer, 'Lagute LW-12')
			.setCharacteristic(Characteristic.Model, 'homebridge-lw12-legacy')
			.setCharacteristic(Characteristic.SerialNumber, 'LW-12 Serial Number');
			
		if (this.debug === true) this.log('creating Lightbulb service');
		
		var lightbulbService = new Service.Lightbulb(this.name);
		
		lightbulbService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getPowerState.bind(this))
			.on('set', this.setPowerState.bind(this));
			
			
    if (this.debug === true) this.log('... adding Brightness');
    lightbulbService
    	.addCharacteristic(new Characteristic.Brightness())
    	.on('get', this.getBrightness.bind(this))
    	.on('set', this.setBrightness.bind(this));

    if (this.debug === true) this.log('... adding Hue');
    lightbulbService
    	.addCharacteristic(new Characteristic.Hue())
    	.on('get', this.getHue.bind(this))
    	.on('set', this.setHue.bind(this));
    	
    if (this.debug === true) this.log('... adding Saturation');
    lightbulbService
    	.addCharacteristic(new Characteristic.Saturation())
    	.on('get', this.getSaturation.bind(this))
    	.on('set', this.setSaturation.bind(this));
    	
    return [informationService, lightbulbService];
  },
  
  getPowerState: function(callback) {
  	var result = this.stripe.getPowerState();
    if (this.debug === true) this.log('... powerState: ' + result);
    callback(null, result);
  },
  
  setPowerState: function(state, callback) {
  	var me = this;
  	if (this.debug === true) this.log('... setting powerState to ' + state);
  	this.stripe.setPowerState(state, function(success) {
  		if (me.debug === true) me.log('... setting powerState success: ' + success);
  		callback(undefined, success)
  	});
  },
  
  getBrightness: function(callback) {
  	var result = this.stripe.getBrightness();
    if (this.debug === true) this.log('... brightness: ' + result);
    callback(null, result);
  },
  
  setBrightness: function(level, callback) {
  	var me = this;
  	if (this.debug === true) this.log('... setting brightness to ' + level);
  	this.stripe.setBrightness(level, function(success) {
  		if (me.debug === true) me.log('... setting brightness success: ' + success);
  		callback(undefined, success)
  	});
  },
  
	getHue: function(callback) {
		var result = this.stripe.getHue();
		if (this.debug === true) this.log('... hue: ' + result);
		callback(null, result);
	},
	
	setHue: function(level, callback) {
		var me = this;
		if (this.debug === true) this.log('... setting hue to ' + level);
		this.stripe.setHue(level, function(success) {
			if (me.debug === true) me.log('... setting hue success: ' + success);
			callback(undefined, success)
		});
	},
	
	getSaturation: function(callback) {
		var result = this.stripe.getSaturation();
		if (this.debug === true) this.log('... saturation: ' + result);
		callback(null, result);
	},
	
	setSaturation: function(level, callback) {
		var me = this;
		if (this.debug === true) this.log('... setting saturation to ' + level);
		this.stripe.setSaturation(level, function(success) {
			if (me.debug === true) me.log('... setting saturation success: ' + success);
			callback(undefined, success)
		});
	}

	
};