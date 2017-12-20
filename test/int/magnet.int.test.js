import {existsSync} from 'fs';
import fs from 'fs-extra';
import Magnet from '../../src/magnet';
import path from 'path';
import Server from '../../src/server';

describe('Magnet', () => {
  describe('#build', () => {
    test('builds app directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(
        existsSync(path.join(magnet.getServerDistDirectory(), 'one.js'))
      ).toBeTruthy();
      expect(
        existsSync(path.join(magnet.getServerDistDirectory(), 'two.js'))
      ).toBeTruthy();
      fs.removeSync(magnet.getServerDistDirectory());
    });

    test('does not build empty directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/empty`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(existsSync(magnet.getServerDistDirectory())).toBeFalsy();
    });
  });

  describe('#getConfig', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    test('returns the instance configuration', () => {
      const magnet = new Magnet({directory});
      const expectedDefaultConfig = {
        magnet: {
          dev: false,
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
          webpack: null,
        },
      };
      expect(magnet.getConfig()).toEqual(expectedDefaultConfig);
    });
  });

  describe('#getDirectory', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    test('returns the instance directory', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getDirectory()).toBe(`${process.cwd()}/test/fixtures/app`);
    });
  });

  describe('#getServer', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    test('returns current server', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getServer() instanceof Server).toBeTruthy();
    });

    test('returns current server engine', () => {
      const magnet = new Magnet({directory});
      expect(isExpress(magnet.getServer().getEngine())).toBeTruthy();
    });
  });

  describe('#getServerDistDirectory', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    test('returns server distribution directory path', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getServerDistDirectory()).toBe(
        `${process.cwd()}/test/fixtures/app/.magnet/server`
      );
    });
  });

  describe('#getFiles', () => {
    test('does not match files inside a static folder', () => {
      const directory = `${process.cwd()}/test/fixtures/static`;
      const magnet = new Magnet({directory});
      const files = magnet.getFiles({directory});
      expect(files).toEqual([]);
    });

    test('returns an empty array if directory is empty', () => {
      const directory = `${process.cwd()}/test/fixtures/empty`;
      const magnet = new Magnet({directory});
      const files = magnet.getFiles({directory});
      expect(files).toEqual([]);
    });

    test('gets files with its realpath', () => {
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
      expect(files).toEqual(expectedArray);
    });
  });

  describe('#getBuildFiles', () => {
    test('gets build files adding start.js and stop.js', () => {
      const directory = `${process.cwd()}/test/fixtures/lifecycle`;
      const magnet = new Magnet({directory});
      const files = magnet.getBuildFiles();
      const expectedArray = ['./one.js', './start.js', './stop.js'];
      expect(files).toEqual(expectedArray);
    });
  });

  describe('#getLoadFiles', () => {
    test('gets load files removing start.js and stop.js', async () => {
      const directory = `${process.cwd()}/test/fixtures/lifecycle`;
      const magnet = new Magnet({directory});
      await magnet.build();
      const files = magnet.getLoadFiles();
      const expectedArray = [
        path.join(magnet.getServerDistDirectory(), 'one.js'),
      ];
      expect(files).toEqual(expectedArray);
    });
  });

  describe('#hasServerDistDirectory', () => {
    test('returns true if server dist directory exists', async () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(magnet.hasServerDistDirectory()).toBeTruthy();
      fs.removeSync(magnet.getServerDistDirectory());
    });

    test('returns false if server dist directory does not exist', () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      expect(magnet.hasServerDistDirectory()).toBeFalsy();
    });
  });

  describe('#start', () => {
    test('starts a http server', async () => {
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

    test('serves an application that just has a static folder', async () => {
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

    test('loads the config using NODE_ENV environment variable without custom configuration', async () => {
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

    test('loads the config with a different directory if configuration directory', async () => {
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

    test('stops the application server', async () => {
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await magnet.stop();
      expect(
        magnet
          .getServer()
          .getHttpServer()
          .address()
      ).toBeNull();
    });

    test('does not delete build folder after stop the application server', async () => {
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await magnet.stop();
      expect(fs.existsSync(magnet.getServerDistDirectory())).toBeTruthy();
    });
  });

  describe('lifecycle', () => {
    const directory = `${process.cwd()}/test/fixtures/lifecycle`;
    test('performs start and stop lifecycle when server starts and stops', async () => {
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      expect(magnet.getServer().getEngine().bootstrapValue).toBe('started');
      await magnet.stop();
      expect(magnet.getServer().getEngine().bootstrapValue).toBe('finished');
    });
  });

  describe('plugins', () => {
    const directory = `${process.cwd()}/test/fixtures/plugin`;

    test("calls plugin's start method", async () => {
      const magnet = new Magnet({directory});
      await magnet.build();

      expect(magnet.__START_WAS_CALLED__).toBeUndefined();

      await magnet.start();
      await magnet.stop();

      expect(magnet.__START_WAS_CALLED__).toBeTruthy();
    });

    test('starts plugins before load', async () => {
      const magnet = new Magnet({directory});
      await magnet.build();

      expect(magnet.__LAST_PLUGIN_METHOD__).toBeUndefined();

      await magnet.start();
      await magnet.stop();

      expect(magnet.__LAST_PLUGIN_METHOD__).toBe('register');
    });
  });
});
