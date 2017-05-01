import resolve from 'resolve';
import {isFunction} from 'metal';

export default (magnet) => {
  const config = magnet.getConfig();
  const pluginPrefix = 'magnet-plugin-';
  const cwd = process.cwd();

  for (const pluginName of config.magnet.plugins) {
    const pluginPath = resolve.sync(`${pluginPrefix}${pluginName}`, {
      basedir: cwd,
    });

    let plugin = require(pluginPath);
    if (plugin.default) {
      plugin = plugin.default;
    }

    magnet.addPlugin(plugin);

    if (isFunction(plugin.babelPresets)) {
      magnet.addBabelPreset(plugin.babelPresets());
    }
  }
};
