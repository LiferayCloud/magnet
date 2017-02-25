import Magnet from '../../../src/magnet';
import path from 'path';
import registratorInjection from '../../../src/registrator/injection';

describe('registratorFunction', () => {
  describe('.test', () => {
    it('should perform the test validation for the input and return true', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      expect(registratorInjection.test(null, testFn, null)).to.be.true;
    });

    it('should perform the test validation for the input and return false if the route is an object', () => { // eslint-disable-line max-len
      const testFn = {
        route: {},
      };
      testFn.default = () => {};
      expect(registratorInjection.test(null, testFn, null)).to.be.false;
    });
  });

  describe('.register', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should inject an object on magnet\'s current injections', () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      const testFn = {
      };
      testFn.default = {foo: 'bar'};

      registratorInjection.register(
        path.join(magnet.getServerDistDirectory(), 'foo.js'),
        testFn,
        magnet,
      );

      expect(magnet.injections.foo).to.deep.equal({foo: 'bar'});
    });

    it('should inject a function on magnet\'s current injections', () => {
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

    it('should inject an object following its namespace based on its folder directories', () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      const testFn = {
      };
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
