import {assertDefAndNotNull, assertString} from 'metal-assertions';
import {isFunction, isObject} from 'metal';

export default {
  test(module, filename, magnet) {
    return isObject(module.route) && isFunction(module.default);
  },
  register(module, filename, magnet) {
    let path = module.route.path;
    let method = module.route.method || 'get';
    let type = module.route.type || 'html';
    let fileshort = filename.substring(magnet.getServerDistDirectory().length);

    assertString(
      method,
      `Route configuration method must be a string, ` + `check ${fileshort}.`
    );
    assertDefAndNotNull(
      path,
      `Route configuration path must be specified, ` + `check ${fileshort}.`
    );

    let app = magnet.getServer().getEngine();

    app[method.toLowerCase()](path, async (req, res, next) => {
      try {
        let result = await module.default.call(module.default, req, res, next);
        if (!res.headersSent) {
          res.type(type).send(result);
        }
      } catch (error) {
        next(error);
      }
    });
  },
};
