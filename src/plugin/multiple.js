import {isFunction, isObject} from 'metal';

const isMultiple = module => {
  return isObject(module.route) && module.route.multiple;
};

export default {
  test(module, filename, magnet) {
    return isMultiple(module) && isFunction(module.default);
  },

  register(module, filename, magnet) {
    let app = magnet.getServer().getEngine();
    module.default.call(module.default, app, magnet);
  },
};
