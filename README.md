# kc9531b

DeepAce kc9531b control lib in JS

## Table of contents

<!-- vim-markdown-toc GFM -->

* [Installation](#installation)
    * [NPM](#npm)
    * [Yarn](#yarn)
* [Usage example](#usage-example)
* [Credits](#credits)

<!-- vim-markdown-toc -->

## Installation

### NPM

```bash
npm install kc9531b --save
```

### Yarn

```bash
yarn add kc9531b
```

## Usage example

```javascript
const { SerialPort } = require("serialport");
const kc9531b = require("kc9531b");

const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });

const device = kc9531b(serialport);

device.getPowerdBm().then(power => {
	console.log("Power: " + power + "dBm");
});
```

## Credits

* [nemanjan00](https://github.com/nemanjan00)

* [deepace](https://deepace.net/) (for creating this magnificent device and API documentation)
