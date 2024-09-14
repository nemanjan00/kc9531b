const { SerialPort } = require("serialport");

const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });

const code = 0x01; // ID of specific task

const size = 0;

const data = Buffer.from([0x31, 0x31, 0x31]);

const header = Buffer.from([
	0xfe, // Magic byte
	0x01, // Protocol version?? - according to USB sniffing
	code,
	data.length & 0xff,
	(data.length & 0xff00) >> 8
]);

const payload = Buffer.concat([header, data])

const cc = Array.from(payload).reduce((prev, cur) => {
	return (prev + cur) & 0xffff;
}, 0)

const signature = Buffer.from([cc & 0xff, (cc & 0xff00) >> 8])

const fullPayload = Buffer.concat([payload, signature]);

console.log(fullPayload);

serialport.on('data', console.log)

serialport.write(fullPayload);
