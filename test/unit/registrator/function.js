import registratorFunction from '../../../src/registrator/function';
import Magnet from '../../../src/magnet';
import path from 'path';

describe('registratorFunction', () => {
  describe('.test', () => {
    it('should perform the test validation for the input and return true', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      testFn.route = {};
      expect(registratorFunction.test(null, testFn, null)).to.be.true;
    });

    it('should perform the test validation for the input and return false if that\'s a string', () => { // eslint-disable-line max-len
      expect(registratorFunction.test(null, 'wrongValue', null)).to.be.false;
    });
  });

  describe('.register', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should register a function on magnet\'s current server engine', () => {
      const magnet = new Magnet({directory});
      const testFn = {
        route: {
          path: '/fn',
          method: 'post',
          type: 'html',
        },
      };
      testFn.default = (req, res) => res.end('fn');

      registratorFunction.register('foo.js', testFn, magnet);

      const app = magnet.getServer().getEngine();
      const routes = app._router
        .stack
        .filter((stack) => {
          if (stack.route && stack.route.path) {
            return true;
          }
        })
        .map((stack) => {
          return stack.route.path;
        });

      expect(routes).to.include('/fn');
    });

    it('should default to get if method is not provided', () => {
      const magnet = new Magnet({directory});
      const testFn = {
        route: {
          path: '/fn',
          type: 'html',
        },
      };
      testFn.default = (req, res) => res.end('fn');

      registratorFunction.register('foo.js', testFn, magnet);

      const app = magnet.getServer().getEngine();

      const routes = app._router
        .stack
        .filter((stack) => {
          if (stack.route && stack.route.path) {
            return true;
          }
        })
        .map((stack) => {
          return {
            path: stack.route.path,
            methods: stack.route.methods,
          };
        });

      expect(routes[0].path).to.equal('/fn');
      expect(routes[0].methods).to.include({get: true});
    });

    it('should set default to html if type is not provided');

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
          magnet.getServerDistDirectory()+'foo.js',
          testFn,
          magnet,
        );
      }).to.throw(Error, 'Route configuration method must be a string, check foo.js.'); // eslint-disable-line max-len
    });

    it('should throw an error if route configuration path is not provided ', () => { // eslint-disable-line max-len
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

  describe('http request', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should start a server and make a request to a defined route with a return instead of a engine request', async () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/fn-return',
        responseBody: JSON.stringify({foo: 'bar'}),
      });

      await magnet.stop();
    });
  });
});
