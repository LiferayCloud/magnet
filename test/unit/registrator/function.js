import Magnet from '../../../src/magnet';
import path from 'path';
import registratorFunction from '../../../src/registrator/function';

describe('registratorFunction', () => {
  describe('.test', () => {
    it('should return true if module object has a route attribute and the default attribute is a function', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      testFn.route = {};
      expect(registratorFunction.test(null, testFn, null)).to.be.true;
    });

    it('should return false if in the module there\'s no route attribute and the default attribute is a function', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      expect(registratorFunction.test(null, testFn, null)).to.be.false;
    });

    it('should return false if in the module the route attribute is not an object and the default attribute is a function', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      testFn.route = 'not an object';
      expect(registratorFunction.test(null, testFn, null)).to.be.false;
    });

    it('should return false if the module\'s default attribute is not a function', () => { // eslint-disable-line max-len
      expect(registratorFunction.test(null, 'wrongValue', null)).to.be.false;
    });
  });

  describe('.register', () => {
    const directory = `${process.cwd()}/test/fixtures/only_config_app`;

    it('should throw an error if provided method is not a string', () => {
      const magnet = new Magnet({directory});

      const testFn = {
        route: {
          path: '/fn',
          type: 'html',
          method: 1,
        },
      };

      testFn.default = (req, res) => res.end('fn');

      expect(function() {
        registratorFunction.register(
          path.join(magnet.getServerDistDirectory(), 'foo.js'),
          testFn,
          magnet,
        );
      }).to.throw(Error, 'Route configuration method must be a string, check /foo.js.'); // eslint-disable-line max-len
    });

    it('should throw an error if route configuration path is null', () => {
      const magnet = new Magnet({directory});
      const testFn = {
        route: {
          path: null,
        },
      };

      testFn.default = (req, res) => res.end('fn');
      expect(function() {
        registratorFunction.register(
          path.join(magnet.getServerDistDirectory(), 'foo.js'),
          testFn,
          magnet,
        );
      }).to.throw(Error, 'Route configuration path must be specified, check /foo.js.'); // eslint-disable-line max-len
    });

    it('should throw an error if route configuration path is undefined ', () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      const testFn = {
        route: {
        },
      };
      testFn.default = (req, res) => res.end('fn');
      expect(function() {
        registratorFunction.register(
          path.join(magnet.getServerDistDirectory(), 'foo.js'),
          testFn,
          magnet,
        );
      }).to.throw(Error, 'Route configuration path must be specified, check /foo.js.'); // eslint-disable-line max-len
    });
  });

  describe('Integration with application folder and http server', () => {
    it('should register a module from the directory when its default attribute is a function and it has a route object attribute', async() => { // eslint-disable-line max-len
      const directory = `${process.cwd()}/test/fixtures/registrator_function_app`; // eslint-disable-line max-len
      const magnet = new Magnet({directory});

      await magnet.build();
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/fn-true',
        responseBody: JSON.stringify({foo: 'bar'}),
      });

      await magnet.stop();
    });

    it('should register a module from the directory when its default attribute is a function that returns a string instead of rendering using response param', async () => { // eslint-disable-line max-len
      const directory = `${process.cwd()}/test/fixtures/registrator_function_app`; // eslint-disable-line max-len
      const magnet = new Magnet({directory});

      await magnet.build();
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/fn-header-not-sent',
        responseBody: 'rendered by helper',
      });

      await magnet.stop();
    });

    it('should set default to html if type is not provided', async () => {
      const directory = `${process.cwd()}/test/fixtures/registrator_function_app`; // eslint-disable-line max-len
      const magnet = new Magnet({directory});

      await magnet.build();
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/fn-no-type',
        contentType: 'text/html; charset=utf-8',
      });

      await magnet.stop();
    });
  });
});
