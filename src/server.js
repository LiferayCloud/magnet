import {assertDefAndNotNull} from 'metal-assertions';
import http from 'http';
import log from './log';

/**
 * Server runtime.
 */
class Server {

  /**
   * Constructor.
   * @param {!Object} engine
   */
  constructor(engine, port, host) {
    assertDefAndNotNull(engine, `Magnet server engine is required`);
    assertDefAndNotNull(port, `port server is required`);
    assertDefAndNotNull(host, `host server is required`);

    /**
     * Server engine.
     * @type {Object}
     * @private
     */
    this.engine_ = engine;

    /**
     * Server port.
     * @type {Number}
     * @public
     */
    this.port_ = port;

    /**
     * Server host.
     * @type {String}
     * @public
     */
    this.host_ = host;

    /**
     * Http server.
     * @type {Http.net.Server}
     * @private
     */
    this.httpServer_ = http.createServer(engine);
  }

  /**
   * Closes http server.
   * @return {Promise} Returns promise that resolves when http server is closed.
   */
  close() {
    return new Promise((resolve) => {
      this.getHttpServer().close(() => resolve());
    });
  }

  /**
   * Gets server engine.
   * @return {Object}
   */
  getEngine() {
    return this.engine_;
  }

  /**
   * Gets server port.
   * @returns {number}
   */
  getPort() {
    return this.port_;
  }

  /**
   * Gets server host.
   * @returns {string}
   */
  getHost() {
    return this.host_;
  }

  /**
   * Gets http server.
   * @return {Http.net.Server}
   */
  getHttpServer() {
    return this.httpServer_;
  }

  /**
   * Starts listening to specified host and port.
   * @param {number} port Server port.
   * @param {string} host Server hostname.
   * @return {Server} Returns server instance.
   */
  listen() {
    let port = this.getPort();
    let host = this.getHost();
    this.getHttpServer()
      .listen(port, host, () =>
        log.info(false, `Ready on http://${host}:${port}`));
    return this;
  }
}

export default Server;
