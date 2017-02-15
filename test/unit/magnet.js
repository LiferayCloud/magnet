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

  describe('#getStopLifecycle', function() {
    it('should get the stop lifecycle ', function() {
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

      const stopFn = (app) => {
        app.foo = 'bar';
      };

      magnet.setStopLifecycle(stopFn);

      expect(magnet.getStopLifecycle()).to.equal(stopFn);
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
      const internalEngine = magnet.getServer().getEngine();
      expect(internalEngine.controllers.one).to.be.an.instanceof(Function);
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
      const internalEngine = magnet.getServer().getEngine();
      expect(internalEngine.models.one).to.be.an.instanceof(Function);
      expect(internalEngine.controllers).to.be.undefined;
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
      const internalEngine = magnet.getServer().getEngine();
      expect(internalEngine.controllers.one).to.be.an.instanceof(Function);
      expect(internalEngine.models).to.be.undefined;
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

  describe('#setStopLifecycle', function() {

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

// describe('magnet', function() {
// 	it('sandbox', async () => {
//     // - External Env Var
//     // Start using default file export
//     process.env.NODE_ENV = process.env.NODE_ENV || 'production';
//     const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;

//     const env = {
//       magnet: {
//         port: 8888,
//         host: 'localhost',
//       },
//     };

//     const engine = new ExpressEngine();

//     const magnetConfig = {
//       appEnvironment: env,
//       appDirectory: appDirectory,
//       serverEngine: engine,
//     };

//     const magnet = new Magnet(magnetConfig);

//     // - External Start and Stop
//     if (existsSync(path.join(appDirectory, 'start.js'))) {
//       let startFn = require(path.join(appDirectory, 'start.js'));

//       if (startFn.default) {
//         startFn = startFn.default;
//       }

//       magnet.setStartLifecycle(startFn);
//     }

//     if (existsSync(path.join(appDirectory, 'stop.js'))) {
//       let stopFn = require(path.join(appDirectory, 'stop.js'));

//       if (stopFn.default) {
//         stopFn = stopFn.default;
//       }

//       magnet.setStopLifecycle(stopFn);
//     }

//     magnet.setupApplication()
//       // .then(magnet.start);
//       .then((instance) => {
//         // console.log(instance);
//         // magnet.start(instance).listen();
//         // console.log(instance.getEngine().controllers.one.toString());
//       });
// 	});
// });
