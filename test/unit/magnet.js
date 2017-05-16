import {existsSync} from 'fs';
import fs from 'fs-extra';
import Magnet from '../../src/magnet';
import path from 'path';
import Server from '../../src/server';

describe('Magnet', () => {
  describe('config', () => {
    it('should raise an error if no options are provided', () => {
      expect(() => {
        new Magnet();
      }).to.throw(
        `Magnet options are required, try: ` +
          `new Magnet({directory: \'/app\'}).`
      );
    });
    it('should raise an error if no directory is provided', () => {
      expect(() => {
        new Magnet({});
      }).to.throw(
        `Magnet directory is required, try: ` +
          `new Magnet({directory: \'/app\'}).`
      );
    });
  });

  describe('#build', () => {
    it('should build app directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(existsSync(path.join(magnet.getServerDistDirectory(), 'one.js')))
        .to.be.true;
      expect(existsSync(path.join(magnet.getServerDistDirectory(), 'two.js')))
        .to.be.true;
      fs.removeSync(magnet.getServerDistDirectory());
    });

    it('should not build empty directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/empty`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(existsSync(magnet.getServerDistDirectory())).to.be.false;
    });
  });

  describe('#getConfig', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should return the instance configuration', () => {
      const magnet = new Magnet({directory});
      const expectedDefaultConfig = {
        magnet: {
          host: 'localhost',
          ignore: [
            'build/**',
            'magnet.config.js',
            'node_modules/**',
            'static/**',
            'test/**',
          ],
          logLevel: 'silent',
          port: 3000,
          src: ['**/*.js'],
          plugins: ['function', 'controller'],
          pluginsConfig: {},
        },
      };
      expect(magnet.getConfig()).to.deep.equal(expectedDefaultConfig);
    });
  });

  describe('#getDirectory', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should return the instance directory', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getDirectory()).to
        .equal(`${process.cwd()}/test/fixtures/app`);
    });
  });

  describe('#getServer', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should return current server', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getServer() instanceof Server).to.be.true;
    });

    it('should return current server engine', () => {
      const magnet = new Magnet({directory});
      expect(isExpress(magnet.getServer().getEngine())).to.equal(true);
    });
  });

  describe('#getServerDistDirectory', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should return server distribution directory path', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getServerDistDirectory()).to
        .equal(`${process.cwd()}/test/fixtures/app/.magnet/server`);
    });
  });

  describe('#getFiles', () => {
    it('should not match files inside a static folder', () => {
      const directory = `${process.cwd()}/test/fixtures/static`;
      const magnet = new Magnet({directory});
      const files = magnet.getFiles({directory});
      expect(files).to.deep.equal([]);
    });

    it('should return an empty array if directory is empty', () => {
      const directory = `${process.cwd()}/test/fixtures/empty`;
      const magnet = new Magnet({directory});
      const files = magnet.getFiles({directory});
      expect(files).to.deep.equal([]);
    });

    it('should get files with its realpath', () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      const files = magnet.getFiles({
        directory,
        realpath: true,
      });
      const expectedArray = [
        path.join(directory, 'one.js'),
        path.join(directory, 'two.js'),
      ];
      expect(files).to.deep.equal(expectedArray);
    });
  });

  describe('#getBuildFiles', () => {
    it('should get build files adding start.js and stop.js', () => {
      const directory = `${process.cwd()}/test/fixtures/lifecycle`;
      const magnet = new Magnet({directory});
      const files = magnet.getBuildFiles();
      const expectedArray = ['./one.js', './start.js', './stop.js'];
      expect(files).to.deep.equal(expectedArray);
    });
  });

  describe('#getLoadFiles', () => {
    it('should get load files removing start.js and stop.js', async () => {
      const directory = `${process.cwd()}/test/fixtures/lifecycle`;
      const magnet = new Magnet({directory});
      await magnet.build();
      const files = magnet.getLoadFiles();
      const expectedArray = [
        path.join(magnet.getServerDistDirectory(), 'one.js'),
      ];
      expect(files).to.deep.equal(expectedArray);
    });
  });

  describe('#hasServerDistDirectory', () => {
    it('should return true if server dist directory exists', async () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(magnet.hasServerDistDirectory()).to.be.true;
      fs.removeSync(magnet.getServerDistDirectory());
    });

    it('should return false if server dist directory does not exist', () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      expect(magnet.hasServerDistDirectory()).to.be.false;
    });
  });

  describe('#start', () => {
    it('should start a http server', async () => {
      const directory = `${process.cwd()}/test/fixtures/app`;
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await assertAsyncHttpRequest({
        path: '/v1',
        responseBody: JSON.stringify({foo: 'bar'}),
      });
      await magnet.stop();
    });

    it('should serve an application that just has a static folder', async () => {
      const directory = `${process.cwd()}/test/fixtures/static`;
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await assertAsyncHttpRequest({
        path: '/static/example1.txt',
        responseBody: 'example1\n',
      });
      await magnet.stop();
    });

    it('should load the config using NODE_ENV environment variable without custom configuration', async () => {
      const currentNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'staging';
      const directory = `${process.cwd()}/test/fixtures/config`;
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await assertAsyncHttpRequest({
        path: '/',
        responseBody: JSON.stringify({environment: 'staging'}),
      });
      await magnet.stop();
      process.env.NODE_ENV = currentNodeEnv;
    });

    it('should load the config with a different directory if configuration directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/config`;
      const configDir = 'environment';
      const magnet = new Magnet({directory, configDir});
      await magnet.build();
      await magnet.start();
      await assertAsyncHttpRequest({
        path: '/',
        responseBody: JSON.stringify({environment: 'default_on_subfolder'}),
      });
      await magnet.stop();
    });
  });

  describe('#stop', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should stop the application server', async () => {
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await magnet.stop();
      expect(magnet.getServer().getHttpServer().address()).to.be.null;
    });
  });

  describe('lifecycle', () => {
    const directory = `${process.cwd()}/test/fixtures/lifecycle`;
    it('should perform start and stop lifecycle when server starts and stops', async () => {
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      expect(magnet.getServer().getEngine().bootstrapValue).to.eq('started');
      await magnet.stop();
      expect(magnet.getServer().getEngine().bootstrapValue).to.eq('finished');
    });
  });

  describe('plugins', () => {
    it('should call plugin\'s start method', async () => {
      const directory = `${process.cwd()}/test/fixtures/plugin`;

      const magnet = new Magnet({directory});
      await magnet.build();

      expect(magnet.__START_WAS_CALLED__).to.eq(undefined);

      await magnet.start();
      await magnet.stop();

      expect(magnet.__START_WAS_CALLED__).to.eq(true);
    });
  });
});
