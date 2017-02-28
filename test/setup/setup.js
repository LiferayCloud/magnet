import {isFunction} from 'metal';
import http from 'http';

module.exports = function(root) {
  root = root ? root : global;
  root.expect = root.chai.expect;

  beforeEach(() => {
    // Using these globally-available Sinon features is preferrable, as they're
    // automatically restored for you in the subsequent `afterEach`.

    root.sandbox = root.sinon.sandbox.create();
    root.stub = root.sandbox.stub.bind(root.sandbox);
    root.spy = root.sandbox.spy.bind(root.sandbox);
    root.mock = root.sandbox.mock.bind(root.sandbox);
    root.isExpress = isExpress;
    root.assertAsyncHttpRequest = assertAsyncHttpRequest;

    root.useFakeTimers = root
      .sandbox
      .useFakeTimers
      .bind(root.sandbox);

    root.useFakeServer = root
      .sandbox
      .useFakeServer
      .bind(root.sandbox);

    root.useFakeXMLHttpRequest = root
      .sandbox
      .useFakeXMLHttpRequest
      .bind(root.sandbox);
  });

  afterEach(() => {
    delete root.stub;
    delete root.spy;
    root.sandbox.restore();
  });
};

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
function assertAsyncHttpRequest({port = 3000, path = '', status = 200, responseBody, contentType}) { // eslint-disable-line max-len
  return new Promise((resolve) => {
    http.get(`http://localhost:${port}${path}`, function(res) {
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          expect(res.statusCode).to.equal(status);
          if(responseBody) {
            expect(responseBody).to.equal(rawData);
          }
          if(contentType) {
            expect(contentType).to.equal(res.headers['content-type']);
          }
          resolve();
        });
    });
  });
}
