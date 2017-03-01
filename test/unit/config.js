import {createConfig} from '../../src/config';

describe('config', function() {
  describe('createConfig', function() {
    it('should thrown an error when directory parameter is not defined', () => {
      expect(function() {
         createConfig(undefined, '', '');
      }).to.throw('Directory must be specified.');
    });

    it('should thrown an error when config parameter is not defined', () => {
      expect(function() {
         createConfig('', undefined, '');
      }).to.throw('Config filename must be specified.');
    });

    it('should thrown an error when config directory parameter is not defined', () => { // eslint-disable-line max-len
      expect(function() {
         createConfig('', '', undefined);
      }).to.throw('Config directory must be specified.');
    });

    it('should return the default config when config file doesn\'t exist', () => { // eslint-disable-line max-len
      const config = createConfig('./', 'magnet.config.js', '');
      const expectedDefaultConfig = {
        magnet: {
          host: '0.0.0.0',
          ignore:
          [
            'build/**',
            'magnet.config.js',
            'node_modules/**',
            'static/**',
            'test/**',
          ],
          logLevel: 'info',
          port: 3000,
          src: ['**/*.js'],
        },
      };
      expect(config).to.deep.equal(expectedDefaultConfig);
    });

    it('should merge attributes from a configuration file with Magnet\'s default config', () => { // eslint-disable-line max-len
      const directory = `${process.cwd()}/test/fixtures/config`;
      const config = createConfig(directory, 'magnet.config.js', '');
      const expectedDefaultConfig = {
        environment: 'default',
        magnet: {
          host: 'localhost',
          ignore:
          [
            'build/**',
            'magnet.config.js',
            'node_modules/**',
            'static/**',
            'test/**',
          ],
          logLevel: 'silent',
          port: 3000,
          src: ['**/*.js'],
        },
      };
      expect(config).to.deep.equal(expectedDefaultConfig);
    });

    it('should merge attributes from a configuration file located in a different location other than the root directory', () => { // eslint-disable-line max-len
      const directory = `${process.cwd()}/test/fixtures/config`;
      const config = createConfig(directory, 'magnet.config.js', 'environment');
      const expectedDefaultConfig = {
        environment: 'default_on_subfolder',
        magnet: {
          host: 'localhost',
          ignore:
          [
            'build/**',
            'magnet.config.js',
            'node_modules/**',
            'static/**',
            'test/**',
          ],
          logLevel: 'silent',
          port: 3000,
          src: ['**/*.js'],
        },
      };
      expect(config).to.deep.equal(expectedDefaultConfig);
    });
  });
});
