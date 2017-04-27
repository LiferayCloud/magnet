import {assertDefAndNotNull, assertString} from 'metal-assertions';
import {isObject} from 'metal';
import nodePath from 'path';
import Component from 'metal-component';

export default {
  test(module, filename, magnet) {
    return isObject(module.route) && Component.isComponentCtor(module.default);
  },
  register(module, filename, magnet) {
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
      async (req, res, next) => {
      try {
        if (!res.headersSent) {
          let data = await module.default.getInitialState(req);
          if (isContentTypeJson(req)) {
            res.json(data);
          } else {
            res.type(type).send(renderToString(module.default, data));
          }
        }
      } catch(error) {
        next(error);
      }
    });
  },
};

/**
 * Render incremental dom based components to string.
 * @param {Class} ctor
 * @param {Object} data
 * @return {string}
 */
function renderToString(ctor, data) {
  try {
    return Component.renderToString(ctor, data);
  } catch (error) {
    throw new Error(
      `Metal.js component type defined in this route cannot be rendered ` +
      `from the server, only Soy or JSX components are supported.`);
  }
}

/**
 * Check if request content type is application/json.
 * @param {Object} req
 * @return {boolean}
 */
function isContentTypeJson(req) {
  const contentType = req.get('content-type') || '';
  return contentType.toLowerCase().indexOf('application/json') === 0;
}
