import {assertDefAndNotNull, assertString} from '../assertions';
import {isString, isObject} from 'metal';

export default {
  test(filename, module, magnet) {
    return isObject(module.route) && isString(module.default);
  },
  register(filename, module, magnet) {
    let path = module.route.path;
    let method = module.route.method || 'get';
    let type = module.route.type || 'html';
    let fileshort = filename.substring(magnet.getServerDistDirectory().length);

    assertString(method, `Route configuration method must be a string, `
      + `check ${fileshort}.`);
    assertDefAndNotNull(path, `Route configuration path must be specified, ` +
      `check ${fileshort}.`);

    let app = magnet.getServer().getEngine();

    app[method.toLowerCase()](path,
      (req, res) => res.type(type).send(module.default));
  },
};
