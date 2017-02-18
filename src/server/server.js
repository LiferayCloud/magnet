import http from 'http';
import logger from 'winston';

/**
 * Server manager implementation.
 */
class Server {
  /**
   * Constructor.
   * @param {!Object} engine Server engine.
   */
  constructor(engine) {
    /**
     * Server engine.
     * @type {Object}
     * @default engine
     * @private
     */
    this.engine_ = engine;

    /**
     * Http server.
     * @type {Http.net.Server}
     * @default Http.net.Server(engine)
     * @private
     */
    this.httpServer_ = http.createServer(engine);
  }

  /**
   * Gets the current engine used in the server instance.
   * @return {Object} Server engine.
   */
  getEngine() {
    return this.engine_;
  }

  /**
   * Gets the http server.
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
    this.getHttpServer().listen(port, host, () => {
      logger.info('[SERVER]', `Address: http://${host}:${port}`);
    });

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
