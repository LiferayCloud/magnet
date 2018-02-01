import {createConfig} from './config';
import morgan from 'morgan';

describe('config', () => {
  describe('createConfig', () => {
    test('throws an error when directory parameter is not defined', () => {
      expect(() => {
        createConfig(undefined, '', '');
      }).toThrow('Directory must be specified.');
    });

    test('throws an error when config parameter is not defined', () => {
      expect(() => {
        createConfig('', undefined, '');
      }).toThrow('Config filename must be specified.');
    });

    test('throws an error when config directory parameter is not defined', () => {
      expect(() => {
        createConfig('', '', undefined);
      }).toThrow('Config directory must be specified.');
    });

    test("returns the default config when config file doesn't exist", () => {
      const config = createConfig('./', 'magnet.config.js', '');
      expect(config.magnet.dev).toBeFalsy();
      expect(config.magnet.host).toBe('0.0.0.0');
      expect(config.magnet.ignore).toEqual([
        'build/**',
        'magnet.config.js',
        'node_modules/**',
        'static/**',
        'test/**',
      ]);
      expect(config.magnet.logLevel).toBe('info');
      expect(config.magnet.port).toBe(3000);
      expect(config.magnet.src).toEqual(['**/*.js']);
      expect(config.magnet.plugins).toEqual(['function', 'controller']);
      expect(config.magnet.requestLogger).toBeInstanceOf(Function);
      expect(config.magnet.pluginsConfig).toEqual({});
      expect(config.magnet.webpack).toBeNull();
    });

    test("merges attributes from a configuration file with Magnet's default config", () => {
      const directory = `${process.cwd()}/test/fixtures/config`;
      const config = createConfig(directory, 'magnet.config.js', '');
      expect(config.environment).toBe('default');
      expect(config.magnet.dev).toBeFalsy();
      expect(config.magnet.host).toBe('localhost');
      expect(config.magnet.ignore).toEqual([
        'build/**',
        'magnet.config.js',
        'node_modules/**',
        'static/**',
        'test/**',
      ]);
      expect(config.magnet.logLevel).toBe('silent');
      expect(config.magnet.port).toBe(3000);
      expect(config.magnet.src).toEqual(['**/*.js']);
      expect(config.magnet.plugins).toEqual(['function', 'controller']);
      expect(config.magnet.requestLogger).toBeInstanceOf(Function);
      expect(config.magnet.pluginsConfig).toEqual({});
      expect(config.magnet.webpack).toBeNull();
    });

    test('merges attributes from a configuration file located in a different location other than the root directory', () => {
      const directory = `${process.cwd()}/test/fixtures/config`;
      const config = createConfig(directory, 'magnet.config.js', 'environment');
      expect(config.environment).toBe('default_on_subfolder');
      expect(config.magnet.dev).toBeFalsy();
      expect(config.magnet.host).toBe('localhost');
      expect(config.magnet.ignore).toEqual([
        'build/**',
        'magnet.config.js',
        'node_modules/**',
        'static/**',
        'test/**',
      ]);
      expect(config.magnet.logLevel).toBe('silent');
      expect(config.magnet.port).toBe(3000);
      expect(config.magnet.src).toEqual(['**/*.js']);
      expect(config.magnet.plugins).toEqual(['function', 'controller']);
      expect(config.magnet.requestLogger).toBeInstanceOf(Function);
      expect(config.magnet.pluginsConfig).toEqual({});
      expect(config.magnet.webpack).toBeNull();
    });
  });
});
