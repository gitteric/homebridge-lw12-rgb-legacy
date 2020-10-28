var net = require('net');

module.exports = function (host, port, debug) {
        var module = {};

        module.host = host;
        module.port = port;
        module.debug = debug;
        module.color = { H: 0, S: 0, V: 100 }
        module.powerState = false;
        module.lastHex = null;

        module.getPowerState = function () {
                return module.powerState;
        }

        module.setPowerState = function (state, callback) {
                var onMessage = 'cc2333';
                var offMessage = 'cc2433';
                if (module.powerState != state){
                        sendHexStringTcp(state ? onMessage : offMessage, function(success) {
                                if (success) {
                                        module.powerState = state;
                                }
                                callback(true);
                        });
                } else {
                        callback(true);
                }
        };

        module.getBrightness = function() {
                return module.color.V;
        }

        module.setBrightness = function (value, callback) {
                module.color.V = value;
                setColor(callback);
        };

        module.getHue = function() {
                return module.color.H;
        }

        module.setHue = function (value, callback) {
                module.color.H = value;
                setColor(callback);
        };

        module.getSaturation = function() {
                return module.color.S;
        }

        module.setSaturation = function (value, callback) {
                module.color.S = value;
                setColor(callback);
        };

        function setColor(callback) {
                var rgb = hsv2rgb(module.color.H, module.color.S, module.color.V);
                var hexString = '56' + decimalToHex(rgb.r, 2) + decimalToHex(rgb.g, 2) + decimalToHex(rgb.b, 2) + 'aa';
                if (module.lastHex != hexString){
                        sendHexStringTcp(hexString, function(success) {
                                module.lastHex = hexString;
                                callback(success);
                        });
                } else {
                        callback(true);
                }
        }


        function sendHexStringTcp(hexMessage, callback) {
                var message = new Buffer(hexMessage, 'hex');
                var client = net.connect({host:module.host, port: module.port}, function () {
                        console.log('TCP connected to ' + module.host + ':' + module.port);
                        if (client.write(message) == true) {
                                console.log('TCP send message ' + hexMessage);
                                callback(true);
                        }
                        else {
                                console.log('TCP failed to send messag');
                                callback(false);
                        }
                });
                client.on('end', function () {
                        console.log('TCP disconnected from server');
                });
                client.on('error', function (error) {
                        console.error('TCP error connecting to ' + module.host + ':' + module.port + ' -> ' + error);
                        client.end();
                        callback(false);
                });
        }
        function decimalToHex(d, padding) {
                var hex = Number(d).toString(16);
                padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
                while (hex.length < padding) {
                        hex = "0" + hex;
                }
                return hex;
        }

        function hsv2rgb (h, s, v) {
                var r, g, b, i, f, p, q, t;

                 h /= 360;
                 s /= 100;
                 v /= 100;

                 i = Math.floor(h * 6);
                 f = h * 6 - i;
                 p = v * (1 - s);
                 q = v * (1 - f * s);
                 t = v * (1 - (1 - f) * s);
                 switch (i % 6) {
                         case 0: r = v; g = t; b = p; break;
                         case 1: r = q; g = v; b = p; break;
                         case 2: r = p; g = v; b = t; break;
                         case 3: r = p; g = q; b = v; break;
                         case 4: r = t; g = p; b = v; break;
                         case 5: r = v; g = p; b = q; break;
                }
                var rgb = { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
                return rgb;
        }

        return module;
};
