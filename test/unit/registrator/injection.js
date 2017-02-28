import Magnet from '../../../src/magnet';
import path from 'path';
import registratorInjection from '../../../src/registrator/injection';

describe('registratorInjection', () => {
  describe('.test', () => {
    it('should return true if module has no route', () => {
      const mod = {};
      mod.default = 'injection value';
      expect(registratorInjection.test(mod, null, null)).to.be.true;
    });

    it('should return true if module route is not object', () => {
      const mod = {};
      mod.route = 'not an object';
      mod.default = 'injection value';
      expect(registratorInjection.test(mod, null, null)).to.be.true;
    });

    it('should false if module route is object', () => {
      const mod = {
        route: {},
      };
      mod.default = 'injection value';
      expect(registratorInjection.test(mod, null, null)).to.be.false;
    });
  });

  describe('.register', () => {
    const directory = `${process.cwd()}/test/fixtures/empty`;

    it('should inject object', () => {
      const magnet = new Magnet({directory});
      const mod = {};
      mod.default = {foo: 'bar'};
      registratorInjection.register(
        mod,
        path.join(magnet.getServerDistDirectory(), 'filename.js'),
        magnet,
      );
      expect(magnet.injections.filename).to.deep.equal({foo: 'bar'});
    });

    it('should inject function', () => {
      const magnet = new Magnet({directory});
      const mod = {};
      mod.default = function() {};
      registratorInjection.register(
        mod,
        path.join(magnet.getServerDistDirectory(), 'filename.js'),
        magnet,
      );
      expect(magnet.injections.filename).to.be.a('function');
    });

    it('should inject value creating namespaces with folder structure', () => {
      const magnet = new Magnet({directory});
      const mod = {};
      mod.default = 'injection value';
      registratorInjection.register(
        mod,
        path.join(magnet.getServerDistDirectory(), 'submodule/foo.js'),
        magnet,
      );
      expect(magnet.injections.submodule.foo).to.deep.equal('injection value');
    });

    it('should inject value from file without extension', () => {
      const directory = `${process.cwd()}/test/fixtures/injection`;
      const magnet = new Magnet({directory});
      const mod = {};
      mod.default = 'injection value';
      registratorInjection.register(
        mod,
        path.join(magnet.getServerDistDirectory(), 'filename'),
        magnet,
      );
      expect(magnet.injections.filename).to.deep.equal('injection value');
    });
  });
});
