# homebridge-lw12-rgb-legacy

Homebridge Plugin for Lacute LW-12 Wifi LED Strip Controller (https://www.amazon.de/gp/product/B00GMAS7U2)
Modified Version of https://github.com/alex224/homebridge-lw12-rgb-ledstrip to make it work with different lw12 (TCP API instead of UDP)

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: sudo npm install -g git+https://github.com/gitteric/homebridge-lw12-rgb-legacy.git
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

Configuration sample file:

 ```
"accessories": [
		{
			"accessory": "LW12-RGB",
			"name": "RGB Led Strip",
			"ip" : "192.168.1.59"
		}
    ]

```
