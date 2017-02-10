import Magnet from '../../src/magnet';
import ExpressEngine from '../../src/server/express-engine';
import Server from '../../src/server/server';
// import {existsSync} from 'fs';
// import path from 'path';
import wiston from 'winston';


describe('Magnet', function() {
  describe('#getAppEnvironment', function() {
    it('should return an empty object if nothing is defined on enviroment', function() {// eslint-disable-line max-len
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/',
        serverEngine: engine,
      };

      let magnet = new Magnet(magnetConfig);

      expect(magnet.getAppEnvironment()).to.deep.equal({});
    });

    it('should return atribbutes and exclude the object magnet', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
        foo: 'bar',
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/',
        serverEngine: engine,
      };

      let magnet = new Magnet(magnetConfig);

      expect(magnet.getAppEnvironment()).to.deep.equal({foo: 'bar'});
    });
  });

  describe('#getDirectory', function() {
    it('should return the same directory provided on the constructor', function() {// eslint-disable-line max-len
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      let magnet = new Magnet(magnetConfig);

      expect(magnet.getDirectory()).to.equal('/foo');
    });
  });

  describe('#getServerEngine', function() {
    it('should return the current server engine', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      let magnet = new Magnet(magnetConfig);

      expect(magnet.getServerEngine()).to.deep.equal(engine);
    });
  });

  describe('#getEnvironment', function() {
    it('should return the current environment', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      let magnet = new Magnet(magnetConfig);

      const expected = {
                          server: {
                            isTest: false,
                            port: 5000,
                            host: 'localhost',
                          },
                          express: {
                            bodyParser: {extended: true},
                            wizard: {
                              verbose: true,
                              cwd: '/foo',
                              logger: wiston,
                            },
                          },
                          injectionFiles: [],
                          exclusionFiles: [],
                          appEnvironment: {},
                        };

      expect(magnet.getEnvironment()).to.deep.equal(expected);
    });
  });

  describe('#getHost', function() {
    it('should get the current host', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      let magnet = new Magnet(magnetConfig);

      expect(magnet.getHost()).to.equal('testhost');
    });
  });

  describe('#getPort', function() {
    it('should get the current port', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      let magnet = new Magnet(magnetConfig);

      expect(magnet.getPort()).to.equal(5000);
    });
  });

  describe('#getServer', function() {
    it('should get the current server instance', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      const magnet = new Magnet(magnetConfig);

      const expressEngine = magnet.getServerEngine()
                                  .getEngine();

      magnet.setServer(expressEngine);

      expect(magnet.getServer()).to.be.an.instanceof(Server);
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

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
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

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
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

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
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

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      const magnet = new Magnet(magnetConfig);

      expect(magnet.getTestBehavior()).to.equal(false);
    });
  });

  describe('#setupApplication', function() {
    it('should inject dependencies of all the files', async () => {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'localhost',
        },
      };

      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
      const engine = new ExpressEngine();
      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: appDirectory,
        serverEngine: engine,
      };

      const magnet = new Magnet(magnetConfig);
      const instance = await magnet.setupApplication();
      const internalEngine = instance.getServerEngine().getEngine();

      expect(internalEngine.controllers.one).to.be.an.instanceof(Function);
    });

    it('should inject dependencies selected files if specified on injectionFiles app config ', async () => {// eslint-disable-line max-len
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'localhost',
          injectionFiles: ['models/**/*.js'],
        },
      };

      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
      const engine = new ExpressEngine();
      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: appDirectory,
        serverEngine: engine,
      };

      const magnet = new Magnet(magnetConfig);
      const instance = await magnet.setupApplication();
      const internalEngine = instance.getServerEngine().getEngine();

      expect(internalEngine.models.one).to.be.an.instanceof(Function);
      expect(internalEngine.controllers).to.be.undefined;
    });

    it('should exclude dependencies selected files if specified on exclusionFiles app config ', async () => {// eslint-disable-line max-len
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'localhost',
          exclusionFiles: ['models/**/*.js'],
        },
      };

      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
      const engine = new ExpressEngine();
      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: appDirectory,
        serverEngine: engine,
      };

      const magnet = new Magnet(magnetConfig);
      const instance = await magnet.setupApplication();
      const internalEngine = instance.getServerEngine().getEngine();

      expect(internalEngine.controllers.one).to.be.an.instanceof(Function);
      expect(internalEngine.models).to.be.undefined;
    });
  });

  describe('#start', function() {

  });

  describe('#stop', function() {

  });

  describe('#setDirectory', function() {
    it('should set app directory', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      const magnet = new Magnet(magnetConfig);
      magnet.setDirectory('/newDirectory');

      expect(magnet.getDirectory()).to.equal('/newDirectory');
    });
  });

  describe('#setEnvironment', function() {
    it('should setEnvironment', function() {
      const magnetEnv = {
        magnet: {
          port: 5000,
          host: 'testhost',
        },
      };

      const engine = new ExpressEngine();

      const magnetConfig = {
        appEnvironment: magnetEnv,
        appDirectory: '/foo',
        serverEngine: engine,
      };

      const magnet = new Magnet(magnetConfig);
      magnet.setEnvironment({foo: 'bar'});

      expect(magnet.getEnvironment()).to.deep.equal({foo: 'bar'});
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
