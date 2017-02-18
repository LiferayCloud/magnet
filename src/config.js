import logger from 'winston';

const baseConfig = () => {
  return {
    app: {
      magnet: {
        exclusionFiles: [
            'build/**',
            'dist/**',
            'node_modules/**',
            'start.js',
        ],
        host: 'localhost',
        injectionFiles: [
          '**/*.js',
        ],
        isTest: false,
        port: 80,
      },
    },
    internal: {
      express: {
        bodyParser: {
          extended: true,
        },
      },
      wizard: {
        cwd: '/',
        logger: logger,
        verbose: true,
      },
    },
  };
};

/**
 * Deep merges object.
 * @param {!Object} destination Destination object.
 * @param {!Object} source Source object.
 * @return {Object} Returns the result of mergint the two params.
 */
function deepMerge(destination, source) {
  for (let property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      deepMerge(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
}

/**
 * Loads base configuration for a specific `appDirectory` merged with
 * `appConfig`.
 * @param {!string} appDirectory Application directory.
 * @param {!Object} appConfig Application config.
 * @return {Object} Returns result of merge and manual assignment
 * of application configuration.
 */
function loadConfig(appDirectory, appConfig) {
  let config = baseConfig();
  deepMerge(config.app, appConfig);
  config.internal.wizard.cwd = appDirectory || '/';
  return config;
}

export {loadConfig};
