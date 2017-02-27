import Magnet from '../../../src/magnet';
import registratorMultiple from '../../../src/registrator/multiple';

describe('registratorMultiple', () => {
  describe('.test', () => {
    it('should return true if module object does not have a route attribute and the default attribute is a function', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = (app, magnet) => {};
      expect(registratorMultiple.test(testFn, null, null)).to.be.true;
    });

    it('should return true if in the module there\'s a route attribute but it\'s not an object and the default attribute is a function', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      testFn.route = 'not an object';

      expect(registratorMultiple.test(testFn, null, null)).to.be.true;
    });

    it('should return false if in the module the route attribute is an object and the default attribute is a function', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      testFn.route = {};

      expect(registratorMultiple.test(testFn, null, null)).to.be.false;
    });

    it('should return false if the module\'s default attribute is not a function', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = 'not a function';

      expect(registratorMultiple.test(testFn, null, null)).to.be.false;
    });
  });

  describe('Integration with application folder and http server', () => {
    it('should register a module with multiple routes from the same file when its default attribute is a function and it has no route object attribute', async () => { // eslint-disable-line max-len
      const directory = `${process.cwd()}/test/fixtures/multiple_registrator_app`; // eslint-disable-line max-len
      const magnet = new Magnet({directory});

      await magnet.build();
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/route-one',
        responseBody: 'one',
      });

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/route-two',
        responseBody: 'two',
      });

      await magnet.stop();
    });
  });
});
