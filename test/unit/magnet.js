import Magnet from '../../src/magnet';
import ServerFactory from '../../src/server/server-factory';
import {isFunction} from 'metal';

describe('Magnet', function() {
  describe('#getAppEnvironment', function() {
  });

  describe('#getAppDirectory', function() {
    it('should return the same directory provided on the constructor', function() {// eslint-disable-line max-len
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
      };
      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment,
        appDirectory: '/foo',
        server,
      };
      let magnet = new Magnet(magnetConfig);
      expect(magnet.getAppDirectory()).to.equal('/foo');
    });
  });

  describe('#getServer', function() {
    it('should get the current server', function() {
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
      };
      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment,
        appDirectory: '/foo',
        server,
      };
      let magnet = new Magnet(magnetConfig);
      expect(magnet.getServer()).to.deep.equal(server);
    });

    it('should get the current server engine', function() {
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };
      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment,
        appDirectory: '/foo',
        server,
      };
      const magnet = new Magnet(magnetConfig);
      expect(isExpress(magnet.getServer().getEngine())).to.equal(true);
    });
  });

  describe('#getHost', function() {
    it('should get the current host', function() {
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };
      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment,
        appDirectory: '/foo',
        server,
      };
      let magnet = new Magnet(magnetConfig);
      expect(magnet.getHost()).to.equal('testhost');
    });
  });

  describe('#getPort', function() {
    it('should get the current port', function() {
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };
      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment,
        appDirectory: '/foo',
        server,
      };
      let magnet = new Magnet(magnetConfig);
      expect(magnet.getPort()).to.equal(5000);
    });
  });

  describe('#getStartLifecycle', function() {
    it('should get the start lifecycle ', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };

      const server = ServerFactory.create();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        server,
      };

      const magnet = new Magnet(magnetConfig);

      const startFn = (app) => {
        app.foo = 'bar';
      };

      magnet.setStartLifecycle(startFn);

      expect(magnet.getStartLifecycle()).to.equal(startFn);
    });
  });

  describe('#getTestBehavior', function() {
    it('should get the test behavior equal to true when specified on app environment', function() {// eslint-disable-line max-len
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
          isTest: true,
        },
      };

      const server = ServerFactory.create();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        server,
      };

      const magnet = new Magnet(magnetConfig);

      expect(magnet.getTestBehavior()).to.equal(true);
    });

    it('should get the test behavior equal to false if not specified', function() {// eslint-disable-line max-len
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };

      const server = ServerFactory.create();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        server,
      };

      const magnet = new Magnet(magnetConfig);

      expect(magnet.getTestBehavior()).to.equal(false);
    });
  });

  describe('#loadApplication', function() {
    it('should inject dependencies of all the files', async () => {
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
      };
      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment,
        appDirectory,
        server,
      };
      const magnet = new Magnet(magnetConfig);
      await magnet.loadApplication();
      expect(magnet.scope.controllers.one).to.be.an.instanceof(Function);
    });

    it('should inject dependencies selected files if specified on injectionFiles app config ', async () => {// eslint-disable-line max-len
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'localhost',
          injectionFiles: ['models/**/*.js'],
        },
      };
      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment,
        appDirectory,
        server,
      };
      const magnet = new Magnet(magnetConfig);
      await magnet.loadApplication();
      expect(magnet.scope.models.one).to.be.an.instanceof(Function);
      expect(magnet.scope.controllers).to.be.undefined;
    });

    it('should exclude dependencies selected files if specified on exclusionFiles app config ', async () => {// eslint-disable-line max-len
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'localhost',
          exclusionFiles: ['models/**/*.js'],
        },
      };
      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment,
        appDirectory,
        server,
      };
      const magnet = new Magnet(magnetConfig);
      await magnet.loadApplication();
      expect(magnet.scope.controllers.one).to.be.an.instanceof(Function);
      expect(magnet.scope.models).to.be.undefined;
    });
  });

  describe('#start', function() {

  });

  describe('#stop', function() {

  });

  describe('#setAppDirectory', function() {
    it('should set app directory', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };

      const server = ServerFactory.create();
      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        server,
      };

      const magnet = new Magnet(magnetConfig);
      magnet.setAppDirectory('/newDirectory');

      expect(magnet.getAppDirectory()).to.equal('/newDirectory');
    });
  });

  describe('#setServerEngine', function() {

  });

  describe('#setHost', function() {

  });

  describe('#setServer', function() {

  });

  describe('#setPort', function() {

  });

  describe('#setStartLifecycle', function() {

  });

  describe('#setTestBehavior', function() {

  });
});

/**
 * Checks if obj is an express() instance.
 * @param {object} obj
 * @return {Boolean}
 */
function isExpress(obj) {
  return obj && obj.name === 'app' && isFunction(obj.use);
}
