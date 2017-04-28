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

> magnet-example@0.0.0 dev ~/P/w/m/e/metal-server-side-rendering
> magnet

> info Config magnet.config.js
> info Building plugins…
> info Building assets…
>
>  ┌────────┬────────┬──────┬───────────┐
>  │ method │ path   │ type │ file      │
>  ├────────┼────────┼──────┼───────────┤
>  │ GET    │ /page1 │ html │ /page1.js │
>  │ GET    │ /page2 │ html │ /page2.js │
>  └────────┴────────┴──────┴───────────┘
>
> info Ready on http://0.0.0.0:3001
```

Now check if routes were registered:

```bash
~/P/w/magnet❯❯❯ curl http://localhost:3001/page1
```

Enjoy!

## License

[BSD License](https://github.com/wedeploy/magnet/blob/master/LICENSE.md) © Liferay, Inc.
