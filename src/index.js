const kc9531 = require("./kc9531b");

module.exports = (socket) => {
	const device = kc9531(socket);

	const control = {
		getDeviceModel: () => {
			const data = Buffer.from([0xfb, 0xfb, 0xfb]);

			return device.executeCommand(data).then(response => {
				return response.toString("utf8");
			});
		},

		getParameters: () => {
			const data = Buffer.from([0xfd, 0xfd, 0xfd]);

			return device.executeCommand(data).then(response => {
				const params = {};

				const modes = {
					0x00: "PEAK",
					0x01: "MEAN",
					0x02: "RMS"
				};

				const baudRate = {
					0x00: 2400,
					0x01: 4800,
					0x02: 9600,
					0x03: 14400,
					0x04: 19200,
					0x05: 38400,
					0x06: 56000,
					0x07: 57600
				};

				params.mode = modes[response[1]];
				params.baudRate = baudRate[response[2]];
				params.RS485ID = response[4];

				console.log(response);

				return params;
			});
		},

		getTemperature: () => {
			const data = Buffer.from([0x33, 0x33, 0x33]);

			return device.executeCommand(data).then(response => {
				return response.readFloatLE();
			});
		},

		setFrequency: (frequency) => {
			const command = Buffer.from([0xf8]);
			const frequencyRepresentation = Buffer.alloc(4);

			frequencyRepresentation.writeUInt32LE(frequency);

			return device.executeCommand(Buffer.concat([command, frequencyRepresentation]));
		},

		getFrequency: () => {
			const data = Buffer.from([0xf7, 0xf7, 0xf7]);

			return device.executeCommand(data).then(response => {
				return response.readUInt32LE();
			});
		},

		getPowerdBm: () => {
			const data = Buffer.from([0x31, 0x31, 0x31]);

			return device.executeCommand(data).then(response => {
				return response.readFloatLE();
			});
		},

		close: () => {
			device.close();
		}
	};

	return control;
};
