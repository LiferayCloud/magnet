## Setup

1. Make sure you have [node and npm](https://nodejs.org/en/download/) installed:

  ```sh
node -v && npm -v
  ```

2. Install dependencies:

  ```sh
npm install
  ```

## Using configuration based on `NODE_ENV` environment variable

* Serve it locally, and watch for any changes:

  ```
npm run dev
  ```

Based on the project's `package.json`, running `npm run dev` performs `magnet`, which sets the value of `NODE_ENV` to `development` in case it is not defined.

Magnet checks if the app has an environment configuration file with the following pattern:

- `magnet.<NODE_ENV>.config.js`

Since `NODE_ENV` has its value, in this case `development`, the file to be loaded is `magnet.development.config.js`.

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

## Using custom configuration file

Custom configuration always wins over the environment variable, passing `-c <filename>` will result in always using the specified file.

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

Note that if you don't specify a `-c` parameter and there's no [configuration file based on NODE_ENV](https://github.com/wedeploy/magnet/tree/master/examples/config#using-configuration-based-on-node_env-environment-variable), Magnet tries to load the file `magnet.config.js`
by default, and if this file doesn't exist, it will use the default configuration values:

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

Enjoy!

## License

[BSD License](https://github.com/wedeploy/magnet/blob/master/LICENSE.md) © Liferay, Inc.
