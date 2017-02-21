## Setup

1. Make sure you have [node and npm](https://nodejs.org/en/download/) installed:

  ```sh
node -v && npm -v
  ```

2. Install dependencies:

  ```sh
npm install
  ```

## Usage

* Serve it locally, and watch for any changes:

  ```
npm run dev
  ```

Your app will be up and running:

```bash
~/P/w/m/e/basic ❯❯❯ npm run dev                                                                                                                

> magnet-example@0.0.0 dev ~/Projects/magnet/examples/basic
> magnet

Hash: 89db1285eb9379c18cd9
Version: webpack 2.2.1
Time: 62ms
        Asset     Size  Chunks             Chunk Names
  ./string.js  2.91 kB       0  [emitted]  ./string.js
   ./start.js  2.72 kB       1  [emitted]  ./start.js
./function.js  2.87 kB       2  [emitted]  ./function.js
 ./default.js  2.78 kB       3  [emitted]  ./default.js
info: [SERVER] Address: http://localhost:3001
```

Now check if routes were registered:

```bash
~/P/w/magnet❯❯❯ curl http://localhost:3001/string
<html>
  <body>
    string
  </body>
  </html>%
```

Enjoy!

## License

[BSD License](https://github.com/wedeploy/magnet/blob/master/LICENSE.md) © Liferay, Inc.
