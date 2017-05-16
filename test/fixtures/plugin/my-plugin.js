export default {
  start(magnet) {
    magnet.__START_WAS_CALLED__ = true;
    magnet.__LAST_PLUGIN_METHOD__ = 'start';
  },

  register(module, file, magnet) {
    magnet.__LAST_PLUGIN_METHOD__ = 'register';
  },

  test() {
    return true;
  },
};
