const { SerialPort } = require("serialport");
const kc9531b = require("../src");

const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });

const device = kc9531b(serialport);

device.getTemperature().then(temperature => {
	console.log(temperature);

	device.getTemperature().then(temperature => {
		console.log(temperature);
	});
});
