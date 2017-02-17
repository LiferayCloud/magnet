import Magnet from '../../src/magnet';
import ServerFactory from '../../src/server/server-factory';
import Wizard from 'express-wizard';

describe('Magnet', () => {
  let appEnvironment;
  let server;

  beforeEach((done) => {
    appEnvironment = {
      magnet: {
        port: 8888,
        host: 'localhost',
      },
    };
    server = ServerFactory.create();
    done();
  });

  describe('config', () => {
    it('should raise an error if no param is provided', () => {
      expect(() => {
         new Magnet();
      }).to.throw('The config param is required');
    });

    it('should raise an error if server is not provided', () => {
      expect(() => {
         new Magnet({appDirectory: 'appDirectory',
                    appEnvironment: {foo: 'bar'}});
      }).to.throw('The server param is required');
    });

    it('should raise an error if app directory is not provided', () => {
      expect(() => {
         new Magnet({server: 'foo', appEnvironment: {foo: 'bar'}});
      }).to.throw('The appDirectory param is required');
    });

    it('should raise an error if app environment is not provided', () => {
      expect(() => {
         new Magnet({server: 'foo', appDirectory: 'appDirectory'});
      }).to.throw('The appEnvironment param is required');
    });
  });

  describe('#getAppDirectory', () => {
    it('should return the same directory provided on the constructor', () => {// eslint-disable-line max-len
      const magnetConfig = {
        appEnvironment,
        appDirectory: '/foo',
        server,
      };
      let magnet = new Magnet(magnetConfig);
      expect(magnet.getAppDirectory()).to.equal('/foo');
    });
  });

  describe('#getServer', () => {
    let appEnvironment = {
      magnet: {
        port: 8888,
        host: 'localhost',
      },
    };
    let server = ServerFactory.create();
    const magnetConfig = {
      appEnvironment,
      appDirectory: '/foo',
      server,
    };

    it('should get the current server', () => {
      let magnet = new Magnet(magnetConfig);
      expect(magnet.getServer()).to.deep.equal(server);
    });

    it('should get the current server engine', () => {
      const magnet = new Magnet(magnetConfig);
      expect(isExpress(magnet.getServer().getEngine()))
        .to.equal(true);
    });
  });

  describe('#getHost', () => {
    it('should get the current host', () => {
      const magnetConfig = {
        appEnvironment,
        appDirectory: '/foo',
        server,
      };
      let magnet = new Magnet(magnetConfig);
      expect(magnet.getHost()).to.equal('localhost');
    });
  });

  describe('#getPort', () => {
    it('should get the current port', () => {
      const magnetConfig = {
        appEnvironment,
        appDirectory: '/foo',
        server,
      };
      let magnet = new Magnet(magnetConfig);
      expect(magnet.getPort()).to.equal(8888);
    });
  });

  describe('#getStartLifecycle', () => {
    it('should get the start lifecycle ', () => {
      const magnetConfig = {
        appEnvironment: appEnvironment,
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

  describe('#getTestBehavior', () => {
    it('should get the test behavior equal to true when specified on app environment', () => {// eslint-disable-line max-len
      const appEnvironment = {
        magnet: {
          port: 5000,
          host: 'testhost',
          isTest: true,
        },
      };

      const magnetConfig = {
        appEnvironment: appEnvironment,
        appDirectory: '/foo',
        server,
      };

      const magnet = new Magnet(magnetConfig);

      expect(magnet.getTestBehavior()).to.equal(true);
    });

    it('should get the test behavior equal to false if not specified', () => {// eslint-disable-line max-len
      const magnetConfig = {
        appEnvironment: appEnvironment,
        appDirectory: '/foo',
        server,
      };

      const magnet = new Magnet(magnetConfig);

      expect(magnet.getTestBehavior()).to.equal(false);
    });
  });

  describe('#loadApplication', () => {
    it('should inject dependencies of all the files', async () => {
      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;

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
          port: 8888,
          host: 'localhost',
          injectionFiles: ['models/**/*.js'],
        },
      };
      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
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
          port: 8888,
          host: 'localhost',
          exclusionFiles: ['models/**/*.js'],
        },
      };
      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
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

    it('should reject the promise in case of error', (done) => {
      const appEnvironment = {
        magnet: {
          port: 8888,
          host: 'localhost',
          exclusionFiles: ['models/**/*.js'],
        },
      };
      const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
      const magnetConfig = {
        appEnvironment,
        appDirectory,
        server,
      };

      const wizardMock = stub(Wizard.prototype, 'into');

      wizardMock.throws('Error message');

      const magnet = new Magnet(magnetConfig);

      magnet.loadApplication()
      .catch((err) => {
        expect(err.toString()).to.equal('Error message');
        done();
      });
    });
  });

  describe('#setAppDirectory', () => {
    it('should set app directory', () => {
      const magnetConfig = {
        appEnvironment: appEnvironment,
        appDirectory: '/foo',
        server,
      };

      const magnet = new Magnet(magnetConfig);
      magnet.setAppDirectory('/newDirectory');

      expect(magnet.getAppDirectory()).to.equal('/newDirectory');
    });
  });

  describe('#start', () => {
    let appEnvironment = {
      magnet: {
        port: 8888,
        host: 'localhost',
        exclusionFiles: ['models/**/*.js'],
      },
    };
    let server = ServerFactory.create();
    const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;
    const magnetConfig = {
      appEnvironment,
      appDirectory,
      server,
    };

    afterEach(() => {
      server.close();
    });

    it('should start an http server', async () => {
      const magnet = new Magnet(magnetConfig);
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 8888,
        responseBody: JSON.stringify({foo: 'bar'}),
      });
    });

    it('should perform the start callback', async() => {
      const magnet = new Magnet(magnetConfig);

      const startFn = spy();
      magnet.setStartLifecycle(startFn);
      await magnet.start();

      expect(startFn.calledOnce).to.be.true;
    });
  });

  describe('#stop', () => {
    it('should stop the server');
  });
});
