const { SerialPort } = require("serialport");
const kc9531b = require("../src/kc9531b");

const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });

const device = kc9531b(serialport);

const data = Buffer.from([0x33, 0x33, 0x33]);

device.executeCommand(data).then(response => {
	console.log(response.readFloatLE());
});
