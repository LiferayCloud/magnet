export default magnet => {
  const config = magnet.getConfig();
  const pluginPrefix = 'magnet-plugin-';

  for (const pluginName of config.magnet.plugins) {
    let plugin = require(`${pluginPrefix}${pluginName}`);
    if (plugin.default) {
      plugin = plugin.default;
    }
    magnet.addPlugin(plugin);
  }
};
