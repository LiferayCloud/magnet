import http from 'http';
import logger from 'winston';

/**
 * Server implementation.
 */
class Server {
  /**
   * Constructor.
   * @param {Object} engine
   */
  constructor(engine) {
    this.engine_ = engine;
    this.httpServer_ = http.createServer(engine);
  }

  /**
   * Gets the current engine used in the server instance.
   * @return {Object}
   */
  getEngine() {
    return this.engine_;
  }

  /**
   * Gets the http server.
   * @return {Http}
   */
  getHttpServer() {
    return this.httpServer_;
  }

  /**
   * Starts listening to specified host and port.
   * @param {integer} port
   * @param {string} host
   * @param {function} cb
   * @return {Server}
   */
  listen(port = 3000, host = 'localhost') {
    this.getHttpServer().listen(port, host, () => {
      logger.info('[SERVER]', `Address: http://${host}:${port}`);
    });

    return this;
  }

  /**
   * Closes http server.
   * @return {Promise}
   */
  close() {
    return new Promise((resolve) => {
      this.getHttpServer().close(() => resolve());
    });
  }
}

export default Server;
