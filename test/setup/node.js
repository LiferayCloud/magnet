import {isFunction} from 'metal';
import http from 'http';

(function(root) {
  root = root ? root : global;

  root.isExpress = isExpress;
  root.assertAsyncHttpRequest = assertAsyncHttpRequest;
})();

/**
 * Checks if obj is an express() instance.
 * @param {object} obj
 * @return {Boolean}
 */
function isExpress(obj) {
  return obj && obj.name === 'app' && isFunction(obj.use);
}

/**
 * Assert async http request
 * @param {String} port
 * @param {String} path
 * @param {integer} status
 * @param {String} responseBody
 * @return {Promise}
 */
function assertAsyncHttpRequest({
  port = 3000,
  path = '',
  status = 200,
  responseBody,
  contentType,
}) {
  return new Promise(resolve => {
    http.get(`http://localhost:${port}${path}`, function(res) {
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => {
        expect(res.statusCode).toBe(status);
        if (responseBody) {
          expect(responseBody).toBe(rawData);
        }
        if (contentType) {
          expect(contentType).toBe(res.headers['content-type']);
        }
        resolve();
      });
    });
  });
}
