const incomingMagicByte = 0xff;
const outgoingMagicByte = 0xfe;

const protocolVersion = 0x01;

module.exports = (socket) => {
	const device = {
		_handlers: {},

		executeCommand: (data) => {
			const code = device.generateCode();
			const command = device.generateCommand(data, code);

			socket.write(command);

			const handler = {};

			const promise = new Promise((resolve, reject) => {
				handler.resolve = resolve;
				handler.reject = reject;
			});

			device._handlers[code] = handler;

			return promise;
		},

		generateCode: () => {
			const code = Math.floor(Math.random() * 255); // ID of specific task

			return code;
		},

		generateCommand: (data, code) => {
			const header = Buffer.from([
				outgoingMagicByte, // Magic byte
				protocolVersion, // Protocol version?? - according to USB sniffing
				code,
				data.length & 0xff,
				(data.length & 0xff00) >> 8
			]);

			const payload = Buffer.concat([header, data])

			const signature = device._cc(payload);

			const fullPayload = Buffer.concat([payload, signature]);

			return fullPayload;
		},

		_state: "init",
		_remainder: Buffer.from([]),

		_handleData: (data) => {
			const fullData = Buffer.concat([device._remainder, data]);

			if(fullData.length === 0) {
				return;
			}

			if(device._state === "init") {
				const position = Array.from(fullData).indexOf(incomingMagicByte);

				if(position === -1) {
					device._remainder = Buffer.from([]);

					return;
				}

				const packet = fullData.slice(position + 1);

				device._state = "packet";

				device._remainder = Buffer.from([]);
				return device._handleData(packet);
			}

			if(device._state === "packet") {
				if(fullData.length < 5) {
					device._remainder = fullData;

					return;
				}

				if(fullData[0] !== protocolVersion) {
					device._state = "init";

					return device._handleData(fullData);
				}

				const code = fullData[1];

				const status = fullData[2];

				const size = (fullData[4] << 8) + fullData[3];

				if(fullData.length < 5 + size + 2) {
					device._remainder = fullData;

					return;
				}

				const body = fullData.slice(5, 5 + size);
				const cc = fullData.slice(5 + size);

				const correctCc = device._cc(Buffer.concat([
					Buffer.from([incomingMagicByte]),
					fullData.slice(0, 5 + size)
				]));

				if(!cc.equals(correctCc)) {
					device._state = "init";

					return device._handleData(fullData);
				}

				if(device._handlers[code]) {
					if(status === 1) {
						device._handlers[code].resolve(body);
					}

					if(status === 0) {
						device._handlers[code].reject(body);
					}

					delete device._handlers[code];
				}

				device._remainder = fullData.slice(5 + size + 2);

				return;
			}

			console.log(data);
		},

		_cc: (payload) => {
			const cc = Array.from(payload).reduce((prev, cur) => {
				return (prev + cur) & 0xffff;
			}, 0);

			const signature = Buffer.from([cc & 0xff, (cc & 0xff00) >> 8])

			return signature;
		},

		_subscribe: () => {
			socket.on("data", device._handleData);
		},

		_unsubscribe: () => {
			socket.off("data", device._handleData);
		},

		close: () => {
			device._unsubscribe();
		}
	};

	device._subscribe();

	return device;
};

