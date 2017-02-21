import {assertDefAndNotNull} from './assertions';
import http from 'http';
import logger from 'winston';

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
  listen(port = 3000, host = 'localhost') {
    this.getHttpServer()
      .listen(port, host, () =>
        logger.info('[SERVER]', `Address: http://${host}:${port}`));
    return this;
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
}

export default Server;
