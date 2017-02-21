import {isFunction, isObject} from 'metal';

export default {
  test(filename, module, magnet) {
    return !isObject(module.route) && isFunction(module.default);
  },
  register(filename, module, magnet) {
    if (module.default.call) {
      let app = magnet.getServer().getEngine();
      module.default.call(module.default, app, magnet);
    }
  },
};
