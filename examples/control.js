const { SerialPort } = require("serialport");
const kc9531b = require("../src");

const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });

const device = kc9531b(serialport);

device.getDeviceModel().then(console.log);

device.getTemperature().then(temperature => {
	console.log(temperature);

	device.setFrequency(300001337).then(() => {
		device.getFrequency().then(frequency => {
			console.log(frequency);
		}).catch(console.error);
	}).catch(console.error);
});
