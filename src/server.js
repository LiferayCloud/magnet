import {assertDefAndNotNull} from 'metal-assertions';
import http from 'http';
import stoppable from 'stoppable';
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
    this.httpServer_ = stoppable(http.createServer(engine), 0);
  }

  /**
   * Closes http server.
   * @return {Promise} Returns promise that resolves when http server is closed.
   */
  stop() {
    return new Promise(resolve => {
      this.getHttpServer().stop(() => resolve());
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
   * @return {number}
   */
  getPort() {
    return this.port_;
  }

  /**
   * Set server port.
   * @param {number} port
   * @return {Server}
   */
  setPort(port) {
    this.port_ = port;
    return this;
  }

  /**
   * Set server host.
   * @param {string} host
   * @return {Server}
   */
  setHost(host) {
    this.host_ = host;
    return this;
  }

  /**
   * Gets server host.
   * @return {string}
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
   * @return {Server} Returns server instance.
   */
  listen() {
    this.getHttpServer().listen(this.getPort(), this.getHost(), () =>
      log.info(false, `Ready on http://${this.getHost()}:${this.getPort()}`)
    );
    return this;
  }
}

export default Server;
