import logger from 'winston';

/**
 * Merge default config with the configs provided by the app
 * @param  {Object} defaultConfig
 * @param  {Object} appConfig
 * @param  {String} appDirectory
 * @return {Object}
 */
function buildAppConfig(defaultConfig, appConfig, appDirectory) {
  defaultConfig.server.port = appConfig.magnet.port || 80;
  defaultConfig.server.host = appConfig.magnet.host || 'localhost';
  defaultConfig.server.isTest = appConfig.magnet.isTest || false;
  defaultConfig.express.wizard.cwd = appDirectory || '/';
  defaultConfig.injectionFiles = appConfig.magnet.injectionFiles || [];
  defaultConfig.exclusionFiles = appConfig.magnet.exclusionFiles || [];

  // TODO: find better way to copy an object without reference.
  let tempAppConfig = Object.assign(appConfig, {});
  delete tempAppConfig.magnet;
  defaultConfig.appEnvironment = tempAppConfig;

  return defaultConfig;
}

const defaultConfig = {
  server: {
    isTest: false,
    port: 80,
    host: 'localhost',
  },
  express: {
    bodyParser: {
      extended: true,
    },
    wizard: {
      verbose: true,
      cwd: '/',
      logger: logger,
    },
  },
  injectionFiles: [],
  exclusionFiles: [],
  appEnvironment: {},
};

export {buildAppConfig, defaultConfig};
