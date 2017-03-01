## Setup

1. Make sure you have [node and npm](https://nodejs.org/en/download/) installed:

  ```sh
node -v && npm -v
  ```

2. Install dependencies:

  ```sh
npm install
  ```

## Default values

Magnet allows changing the default values of its internal configuration by passing your own file. When no custom file is specified it uses the following values out of the box.

```js
{
  magnet: {
    host: '0.0.0.0',
    ignore: [
      'build/**',
      'magnet.config.js',
      'node_modules/**',
      'static/**',
      'test/**',
    ],
    logLevel: 'info',
    port: 3000,
    src: ['**/*.js'],
  },
}
```


## Custom configuration file

To overwrite configuration values you can specify `-c <filename>` to Magnet. For more information take a look on the example below.

* Serve it locally, and watch for any changes:

```
magnet -c magnet.config.js
```

Your app will be up and running:

```bash
~/P/w/m/e/validation ❯❯❯ magnet -c magnet.config.js

> info Building assets…
> info Ready on http://0.0.0.0:3000
```

Now check if routes were registered:

```bash
~/P/w/magnet❯❯❯ curl http://localhost:3000/
{"environment_message":"Custom is up and running"}%
```

The response will use the value defined in [magnet.config.js](https://github.com/wedeploy/magnet/blob/master/examples/config/magnet.config.js) file.

## Auto loading configuration from environment

Sometimes you need a fancier setup or different folder structure for your project, that's fine, we got you. Magnet detects the presence of `NODE_ENV` environment variable and automatic loads a file that matches to `magnet.<NODE_ENV>.config.js`. For more details try the example below.

* Serve it locally, and watch for any changes:

  ```
npm run dev
  ```

By running `magnet dev` it sets the `NODE_ENV` to `development` in case it is not defined, then Magnet checks if the app has an environment configuration file that matches the pattern described previously.

Since `NODE_ENV` has a value, in this case `development`, the file to be loaded is `magnet.development.config.js`.

Your app will be up and running:

```bash
~/P/w/m/e/config ❯❯❯ npm run dev

> config@ dev ~/P/w/m/e/config
> magnet

> info Building assets…
> info Ready on http://0.0.0.0:3001
```

Now check if routes were registered:

```bash
~/P/w/magnet❯❯❯ curl http://localhost:3001/
{"environment_message":"Development is up and running"}%
```

Custom configuration always wins over the environment variable, passing `-c <filename>` will result in always using the specified file.

Enjoy!

## License

[BSD License](https://github.com/wedeploy/magnet/blob/master/LICENSE.md) © Liferay, Inc.
