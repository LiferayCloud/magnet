import {isFunction, isObject} from 'metal';

export default {
  test(module, filename, magnet) {
    return !isObject(module.route) && isFunction(module.default);
  },

  register(module, filename, magnet) {
    let app = magnet.getServer().getEngine();
    module.default.call(module.default, app, magnet);
  },
};
