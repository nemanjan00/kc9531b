const kc9531 = require("./kc9531b");

module.exports = (socket) => {
	const device = kc9531(socket);

	const control = {
		getTemperature: () => {
			const data = Buffer.from([0x33, 0x33, 0x33]);

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
