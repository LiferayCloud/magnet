import {isFunction} from 'metal';
import log from '../log';
import webpack from 'webpack';

/**
 * Builds client using webpack config.
 * @param {Magnet} magnet
 */
export async function buildClient(magnet) {
  log.info(false, 'Building client…');
  await maybeSetupPluginsWebpack_(magnet);
  await maybeSetupMagnetWebpack_(magnet);
  if (Object.keys(magnet.webpackConfig.entry).length) {
    await runWebpack_(magnet);
  }
}

/**
 * Maybe run webpack if it has entries.
 * @param {Magnet} magnet
 * @return {Promise}
 * @private
 */
function runWebpack_(magnet) {
  return new Promise((resolve, reject) => {
    webpack(magnet.webpackConfig, (err, stats) => {
      if (err) {
        log.error(false, err);
        reject(err);
      }
      const output = stats.toString({
        colors: true,
        chunks: false,
      });
      resolve(output);
    });
  });
}

/**
 * Maybe setup Plugins webpack configuration.
 * @param {Magnet} magnet
 * @private
 */
async function maybeSetupPluginsWebpack_(magnet) {
  try {
    for (const plugin of magnet.getPlugins()) {
      if (isFunction(plugin.webpackConfig)) {
        magnet.webpackConfig = await plugin.webpackConfig(
          magnet.webpackConfig,
          magnet
        );
      }
    }
  } catch (error) {
    log.error(false, error);
  }
}

/**
 * Maybe applies magnet webpack config.
 * @param {Magnet} magnet
 * @private
 */
async function maybeSetupMagnetWebpack_(magnet) {
  const magnetConfig = magnet.getConfig().magnet;

  if (isFunction(magnetConfig.webpack)) {
    magnet.webpackConfig = await magnetConfig.webpack(
      magnet.webpackConfig,
      magnet
    );
  }
}
