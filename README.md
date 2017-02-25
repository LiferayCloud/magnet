<h1 align="center">✨ Magnet</h1>


<h5 align="center">Simple, fast and unopinionated uses the power of ES2015 and beyond into your microservices</h5>


<div align="center">
  <a href="http://travis-ci.com/wedeploy/magnet">
    <img src="https://travis-ci.com/wedeploy/magnet.svg?token=a51FNuiJPYZtHhup9q1V&branch=master" alt="Travis CI" />
  </a>

  <a href="https://codecov.io/gh/wedeploy/magnet">
    <img src="https://codecov.io/gh/wedeploy/magnet/branch/master/graph/badge.svg" alt="Coverage" />
  </a>

  <a href="https://codebeat.co/projects/github-com-wedeploy-magnet">
    <img alt="codebeat badge" src="https://codebeat.co/badges/05e27c84-b714-4d51-aa74-287707fb8a15" />
  </a>

  <a href="https://www.npmjs.com/package/magnet">
    <img src="https://img.shields.io/npm/v/magnet.svg" alt="Npm" />
  </a>

  <img src="https://img.shields.io/npm/l/magnet.svg" alt="License">
</div>

## Getting started

Generate a boilerplate project:

```sh
mkdir myproject/
magnet generate
```

Results in

```sh
~/D/myproject ❯❯❯ magnet generate
> info Generating files
> info Done.
```

Then install dependencies and run:

```sh
npm install
npm run dev
```

Results in

```sh
~/D/myproject ❯❯❯ npm run dev

> myproject@ dev /Users/eduardo/Desktop/myproject
> magnet

> info Building assets…

Hash: cf649a3dac04233a9e9b
Version: webpack 2.2.1
Time: 67ms
     Asset     Size  Chunks             Chunk Names
./index.js  3.05 kB       0  [emitted]  ./index.js
  ./api.js   2.9 kB       1  [emitted]  ./api.js

┌────────┬──────┬──────┬───────────┐
│ method │ path │ type │ file      │
├────────┼──────┼──────┼───────────┤
│ GET    │ /api │ json │ /api.js   │
│ GET    │ /    │ html │ /index.js │
└────────┴──────┴──────┴───────────┘

> info Ready on http://0.0.0.0:3000
```

Your microservice is ready for development on [http://localhost:3000](http://localhost:3000)!

## Running in production

To run your application in production use `npm start` instead and Magnet will serve your application optimized for production.

## Examples

If you need examples of magnet usage, you can access othe examples on its repository [folder](https://github.com/wedeploy/magnet/tree/master/examples).

## License

[BSD License](https://github.com/wedeploy/magnet/blob/master/LICENSE.md) © Liferay, Inc.
