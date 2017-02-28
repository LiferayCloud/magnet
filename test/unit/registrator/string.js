import Magnet from '../../../src/magnet';
import path from 'path';
import registratorString from '../../../src/registrator/string';

describe('registratorString', () => {
  describe('.test', () => {
    it('should return true if module has a valid route', () => {
      const mod = {};
      mod.default = 'string';
      mod.route = {};
      expect(registratorString.test(mod, null, null)).to.be.true;
    });

    it('should return false if module has a invalid route', () => {
      const mod = {};
      mod.default = 'string';
      mod.route = undefined;
      expect(registratorString.test(mod, null, null)).to.be.false;
    });

    it('should return false if module does not export string', () => {
      const mod = {};
      mod.default = undefined;
      mod.route = {};
      expect(registratorString.test(mod, null, null)).to.be.false;
    });
  });

  describe('.register', () => {
    const directory = `${process.cwd()}/test/fixtures/empty`;

    it('should throw exception if route method is not string', () => {
      const magnet = new Magnet({directory});
      const mod = {
        route: {
          path: '/fn',
          method: 1,
        },
      };
      mod.default = 'string';

      expect(function() {
        registratorString.register(
          mod,
          path.join(magnet.getServerDistDirectory(), 'filename.js'),
          magnet,
        );
      }).to.throw(Error, 'Route configuration method must be a string, check /filename.js.'); // eslint-disable-line max-len
    });

    it('should throw an error if route configuration path is null', () => {
      const magnet = new Magnet({directory});
      const mod = {
        route: {
          path: null,
        },
      };
      mod.default = 'string';
      expect(function() {
        registratorString.register(
          mod,
          path.join(magnet.getServerDistDirectory(), 'filename.js'),
          magnet,
        );
      }).to.throw(Error, 'Route configuration path must be specified, check /filename.js.'); // eslint-disable-line max-len
    });

    it('should throw an error if route configuration path is undefined', () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      const mod = {
        route: {
        },
      };
      mod.default = 'string';
      expect(function() {
        registratorString.register(
          mod,
          path.join(magnet.getServerDistDirectory(), 'filename.js'),
          magnet,
        );
      }).to.throw(Error, 'Route configuration path must be specified, check /filename.js.'); // eslint-disable-line max-len
    });
  });

  describe('integration', () => {
    let magnet;
    const directory = `${process.cwd()}/test/fixtures/string`;

    beforeEach(async () => {
      magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
    });

    afterEach(async () => {
      await magnet.stop();
    });

    it('should register string module from directory', async() => {
      await assertAsyncHttpRequest({
        path: '/string',
        responseBody: 'valid string',
      });
    });

    it('should register string module from directory with default type html', async () => { // eslint-disable-line max-len
      await assertAsyncHttpRequest({
        path: '/string-no-type',
        contentType: 'text/html; charset=utf-8',
      });
    });
  });
});
