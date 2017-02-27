import Magnet from '../../../src/magnet';
import path from 'path';
import registratorString from '../../../src/registrator/string';

describe('registratorString', () => {
  describe('.test', () => {
    it('should return true if module object have a route attribute and the default attribute is a string', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = 'foo';
      testFn.route = {};
      expect(registratorString.test(null, testFn, null)).to.be.true;
    });

    it('should return false if in the module there\'s a route attribute but it\'s not an object and the default attribute is a string', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = 'foo';
      testFn.route = 'foo';

      expect(registratorString.test(null, testFn, null)).to.be.false;
    });

    it('should return false if in the module the route attribute is an object and the default attribute is not a string', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      testFn.route = {};

      expect(registratorString.test(null, testFn, null)).to.be.false;
    });
  });

  describe('.register', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

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
        registratorString.register(
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
        registratorString.register(
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
        registratorString.register(
          path.join(magnet.getServerDistDirectory(), 'foo.js'),
          testFn,
          magnet,
        );
      }).to.throw(Error, 'Route configuration path must be specified, check /foo.js.'); // eslint-disable-line max-len
    });
  });

  describe('http request', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should start a server and make a request to a defined route with a string', async () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();

      const htmlString = `<html>
  <body>
    string
  </body>
  </html>`;

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/string',
        responseBody: htmlString,
      });

      await magnet.stop();
    });
  });

  describe('Integration with application folder and http server', () => {
    it('should register a module from the directory when its default attribute is a string and it has a route object attribute', async() => { // eslint-disable-line max-len
      const directory = `${process.cwd()}/test/fixtures/string_registrator_app`; // eslint-disable-line max-len
      const magnet = new Magnet({directory});

      await magnet.build();
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/string-true',
        responseBody: 'valid string',
      });

      await magnet.stop();
    });

    it('should set default to html if type is not provided', async () => {
      const directory = `${process.cwd()}/test/fixtures/string_registrator_app`; // eslint-disable-line max-len
      const magnet = new Magnet({directory});

      await magnet.build();
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/string-no-type',
        contentType: 'text/html; charset=utf-8',
      });

      await magnet.stop();
    });
  });
});
