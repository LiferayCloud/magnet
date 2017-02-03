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
  defaultConfig.server.testBehavior = appConfig.magnet.TestBehavior || false;
  defaultConfig.express.wizard.cwd = appDirectory || '/';

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
  app: {
    model: {
      schema: {
        unknownProperties: 'delete',
      },
      update: {
        returnChanges: true,
      },
    },
  },
};

export {buildAppConfig, defaultConfig};
