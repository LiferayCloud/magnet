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
  constructor(engine) {
    assertDefAndNotNull(engine, `Magnet server engine is required`);

    /**
     * Server engine.
     * @type {Object}
     * @private
     */
    this.engine_ = engine;

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
  listen(port, host) {
    this.getHttpServer()
      .listen(port, host, () =>
        log.info(false, `Ready on http://${host}:${port}`));
    return this;
  }
}

export default Server;
