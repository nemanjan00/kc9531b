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
