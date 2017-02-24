import registratorMultiple from '../../../src/registrator/multiple';
import Magnet from '../../../src/magnet';

describe('registratorMultiple', () => {
  describe('.test', () => {
    it('should perform the test validation for the input and return true', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = (app, magnet) => {};
      expect(registratorMultiple.test(null, testFn, null)).to.be.true;
    });

    it('should perform the test validation for the input and return false if the route is an object', () => { // eslint-disable-line max-len
      const testFn = {
        route: {},
      };
      testFn.default = (app, magnet) => {};
      expect(registratorMultiple.test(null, testFn, null)).to.be.false;
    });
  });

  describe('.register', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('shluld call the default function and register a route into magnet\'s current server engine', () => { // eslint-disable-line max-len
      const magnet = new Magnet({directory});
      const testFn = {};
      testFn.default = (app) => {
        app.get('/foo', (req, res) => {
          res.json({foo: 'bar'});
        });
      };

      registratorMultiple.register('foo.js', testFn, magnet);

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

      expect(routes).to.include('/foo');
    });
  });
});
