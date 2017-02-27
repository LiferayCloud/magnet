import Magnet from '../../../src/magnet';
import path from 'path';
import registratorInjection from '../../../src/registrator/injection';

describe('registratorInjection', () => {
  describe('.test', () => {
    it('should return true if there\'s no route attribute in the module', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      expect(registratorInjection.test(null, testFn, null)).to.be.true;
    });

    it('should return true if the route attribute in the module is not an object', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.route = 'not an object';
      testFn.default = () => {};
      expect(registratorInjection.test(null, testFn, null)).to.be.true;
    });

    it('should false if the module if the route attribute is an object', () => {
      const testFn = {
        route: {},
      };
      testFn.default = () => {};
      expect(registratorInjection.test(null, testFn, null)).to.be.false;
    });
  });

  describe('.register', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should inject an object into injections public attribute', () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      const testFn = {};
      testFn.default = {foo: 'bar'};

      registratorInjection.register(
        path.join(magnet.getServerDistDirectory(), 'foo.js'),
        testFn,
        magnet,
      );

      expect(magnet.injections.foo).to.deep.equal({foo: 'bar'});
    });

    it('should inject a function into injections public attribute', () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      const testFn = {
      };
      testFn.default = () => {};

      registratorInjection.register(
        path.join(magnet.getServerDistDirectory(), 'foo.js'),
        testFn,
        magnet,
      );

      expect(magnet.injections.foo).to.be.a('function');
    });

    it('should inject an object creating namespaces following its folder directories', () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      const testFn = {};
      testFn.default = {foo: 'bar'};

      registratorInjection.register(
        path.join(magnet.getServerDistDirectory(), 'submodule/foo.js'),
        testFn,
        magnet,
      );

      expect(magnet.injections.submodule.foo).to.deep.equal({foo: 'bar'});
    });
  });
});
