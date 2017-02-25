<h1 align="center">✨ Magnet</h1>


<h5 align="center">A productive web framework that does not compromise speed, simplicity and maintainability</h5>


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

```
$ npm install -g magnet
```

Generate a boilerplate project:

```
$ mkdir myproject/
$ magnet generate
$ npm start
```

Your microservice is ready on [http://localhost:3000](http://localhost:3000)!

So far, we get:

* Automatic ES2015 and beyond transpilation and bundling (with webpack and babel).
* Static file serving: If present, a folder named `static` is served as `http://localhost:3000/static/`.
* Configurable with a [magnet.config.js](https://github.com/wedeploy/magnet/blob/master/examples/basic/magnet.config.js)
* Error handling.
* Security (DNS Prefetch Control, clickjacking, hide powered by [and more](https://github.com/helmetjs/helmet#how-it-works).
* Compression (deflate, gzip).
* Express.js support for routing.


## Production deployment

To deploy your application, you just need to define the command start and magnet will serve your application using the port defined in your configuration.

For example, to deploy with now a package.json like follows is recommended:

```
{
  "name": "myproject",
  "dependencies": {
    "magnet": "latest"
  },
  "scripts": {
    "dev": "magnet",
    "start": "magnet start"
  }
}
```

Then run `npm run start` and enjoy!

Note: It is recommend adding `.magnet` in `.gitignore`.

## Examples

If you need examples of magnet usage, you can access othe examples on its repository [folder](https://github.com/wedeploy/magnet/tree/master/examples).


## License

[BSD License](https://github.com/wedeploy/magnet/blob/master/LICENSE.md) © Liferay, Inc.
