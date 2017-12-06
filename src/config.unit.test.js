import {createConfig} from './config';

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

    test('returns the default config when config file doesn\'t exist', () => {
      const config = createConfig('./', 'magnet.config.js', '');
      const expectedDefaultConfig = {
        magnet: {
          dev: false,
          host: '0.0.0.0',
          ignore: [
            'build/**',
            'magnet.config.js',
            'node_modules/**',
            'static/**',
            'test/**',
          ],
          logLevel: 'info',
          port: 3000,
          src: ['**/*.js'],
          plugins: ['function', 'controller'],
          pluginsConfig: {},
          webpack: null,
        },
      };
      expect(config).toEqual(expectedDefaultConfig);
    });

    test('merges attributes from a configuration file with Magnet\'s default config', () => {
      const directory = `${process.cwd()}/test/fixtures/config`;
      const config = createConfig(directory, 'magnet.config.js', '');
      const expectedDefaultConfig = {
        environment: 'default',
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
      expect(config).toEqual(expectedDefaultConfig);
    });

    test('merges attributes from a configuration file located in a different location other than the root directory', () => {
      const directory = `${process.cwd()}/test/fixtures/config`;
      const config = createConfig(directory, 'magnet.config.js', 'environment');
      const expectedDefaultConfig = {
        environment: 'default_on_subfolder',
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
      expect(config).toEqual(expectedDefaultConfig);
    });
  });
});
