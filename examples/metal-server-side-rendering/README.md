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

> magnet-example@0.0.0 dev ~/P/w/m/e/basic
> magnet

> info Building assets…

> ┌────────┬─────────┬──────┬───────────────┐
> │ method │ path    │ type │ file          │
> ├────────┼─────────┼──────┼───────────────┤
> │ GET    │ /fn1    │ html │ /function1.js │
> │ GET    │ /fn2    │ html │ /function2.js │
> │ GET    │ /fn3    │ html │ /function3.js │
> │ ―      │ ―       │ ―    │ /multiple.js  │
> │ GET    │ /string │ html │ /string.js    │
> └────────┴─────────┴──────┴───────────────┘

> info Ready on http://localhost:3001
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
