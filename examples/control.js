const { SerialPort } = require("serialport");
const kc9531b = require("../src");

const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });

const device = kc9531b(serialport);

device.getDeviceModel().then(console.log);

device.getPowerdBm().then(power => {
	console.log("Power: " + power + "dBm");
});

device.getPowermW().then(power => {
	console.log("Power: " + power + "mW");
});

device.setFrequency(300000000).then(() => {
	device.getFrequency().then(frequency => {
		console.log("Frequency: " + (frequency / 1000000) + "MHz");
	}).catch(console.error);
}).catch(console.error);

device.getTemperature().then(temperature => {
	console.log("Temperature: " + temperature + "°c");
});

device.getParameters().then(params => {
	console.log(params);
});
