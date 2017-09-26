import webpack from 'webpack';
import log from '../log';
import {isFunction} from 'metal';

/**
 * Builds client using webpack config.
 * @param {Magnet} magnet
 */
export async function buildClient(magnet) {
  await maybeBuildPlugins_(magnet);
  await maybeSetupPluginsWebpack_(magnet);
  await maybeSetupMagnetWebpack_(magnet);
  await maybeRunWebpack_(magnet);
}
/**
 * Maybe runs webpack if it has entries.
 * @param {Magnet} magnet
 * @return {Promise}
 * @private
 */
function maybeRunWebpack_(magnet) {
  return new Promise((resolve, reject) => {
    if (!Object.keys(magnet.webpackConfig.entry).length) {
      resolve(false);
      return;
    }
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
 * Maybe build plugins.
 * @param {Magnet} magnet
 * @private
 */
async function maybeBuildPlugins_(magnet) {
  log.info(false, 'Building plugins…');
  try {
    for (const plugin of magnet.getPlugins()) {
      if (isFunction(plugin.build)) {
        await plugin.build(magnet);
      }
    }
  } catch (error) {
    log.error(false, error);
  }
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
