import Magnet from '../../../src/magnet';
import path from 'path';
// import pluginFunction from '../../../src/plugin/function';

describe('pluginFunction', () => {
  // describe('.test', () => {
  //   it('should return true if module has a valid route', () => {
  //     const mod = {};
  //     mod.default = function() {};
  //     mod.route = {};
  //     expect(pluginFunction.test(mod, null, null)).to.be.true;
  //   });

  //   it('should return true if module has no route', () => {
  //     const mod = {};
  //     mod.default = function() {};
  //     expect(pluginFunction.test(mod, null, null)).to.be.false;
  //   });

  //   it('should return true if module has route undefined', () => {
  //     const mod = {};
  //     mod.default = function() {};
  //     mod.route = undefined;
  //     expect(pluginFunction.test(mod, null, null)).to.be.false;
  //   });

  //   it('should return false if module is not function', () => {
  //     expect(pluginFunction.test('notFn', null, null)).to.be.false;
  //   });
  // });

  // describe('.register', () => {
  //   const directory = `${process.cwd()}/test/fixtures/empty`;

  //   it('should throw exception if route method is not string', () => {
  //     const magnet = new Magnet({directory});
  //     const mod = {
  //       route: {
  //         path: '/fn',
  //         method: 1,
  //       },
  //     };
  //     mod.default = function() {};
  //     expect(function() {
  //       pluginFunction.register(
  //         mod,
  //         path.join(magnet.getServerDistDirectory(), 'filename.js'),
  //         magnet
  //       );
  //     }).to.throw(
  //       Error,
  //       'Route configuration method must be a string, check /filename.js.'
  //     );
  //   });

  //   it('should throw an error if route configuration path is null', () => {
  //     const magnet = new Magnet({directory});
  //     const mod = {
  //       route: {
  //         path: null,
  //       },
  //     };
  //     mod.default = function() {};
  //     expect(function() {
  //       pluginFunction.register(
  //         mod,
  //         path.join(magnet.getServerDistDirectory(), 'filename.js'),
  //         magnet
  //       );
  //     }).to.throw(
  //       Error,
  //       'Route configuration path must be specified, check /filename.js.'
  //     );
  //   });

  //   it('should throw an error if route configuration path is undefined', () => {
  //     const magnet = new Magnet({directory});
  //     const mod = {
  //       route: {},
  //     };
  //     mod.default = function() {};
  //     expect(function() {
  //       pluginFunction.register(
  //         mod,
  //         path.join(magnet.getServerDistDirectory(), 'filename.js'),
  //         magnet
  //       );
  //     }).to.throw(
  //       Error,
  //       'Route configuration path must be specified, check /filename.js.'
  //     );
  //   });
  // });

  describe('integration', () => {
    let magnet;
    const directory = `${process.cwd()}/test/fixtures/function`;

    beforeEach(async () => {
      magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
    });

    afterEach(async () => {
      await magnet.stop();
    });

    it('should register string module from directory that ends response', async () => {
      await assertAsyncHttpRequest({
        path: '/fn-header-sent',
        responseBody: 'headers sent',
      });
    });

    it('should register string module from directory that does not ends response', async () => {
      await assertAsyncHttpRequest({
        path: '/fn-header-not-sent',
        responseBody: 'headers not sent',
      });
    });

    it('should set default type to to html if not specified', async () => {
      await assertAsyncHttpRequest({
        path: '/fn-no-type',
        contentType: 'text/html; charset=utf-8',
      });
    });
  });
});
