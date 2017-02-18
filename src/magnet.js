import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import logger from 'winston';
import morgan from 'morgan';
import path from 'path';
import {isFunction} from 'metal';
import Wizard from 'express-wizard';
import {assertDefAndNotNull} from './assertions';
import errorMiddleware from './middleware/general-errors';
import {loadConfig} from './config';

/**
 * Magnet main class.
 */
class Magnet {

  /**
   * Constructor.
   * @param  {!Object} config Default configuration with
   * server, app directory and app environment.
   */
  constructor(config) {
    assertDefAndNotNull(config, 'The config param is required');
    assertDefAndNotNull(config.server, 'The server param is required');
    assertDefAndNotNull(config.appDirectory,
      'The appDirectory param is required');
    assertDefAndNotNull(config.appEnvironment,
      'The appEnvironment param is required');

    /**
     * Application directory based on provided path.
     * @type {string}
     * @default null
     * @private
     */
    this.appDirectory_ = null;

    /**
     * Application environment.
     * @type {Object}
     * @default null
     * @private
     */
    this.environment_ = null;

    /**
     * Application test behavior.
     * @type {boolean}
     * @default null
     * @private
     */
    this.isTest_ = null;

    /**
     * Server host.
     * @type {string}
     * @default null
     * @private
     */
    this.host_ = null;

    /**
     * Server port.
     * @type {string}
     * @default null
     * @private
     */
    this.port_ = null;

    /**
     * Scope that receives dependency injections from scanned files.
     * @type {object}
     * @default {}
     * @public
     */
    this.scope = {};

    /**
     * Default server engine used to handle http requests.
     * @type {Server}
     * @default null
     * @private
     */
    this.server_ = null;

    /**
     * Default function to be performed when server starts with an application.
     * @type {Function}
     */
    this.startFn_ = null;

    this.environment_ = loadConfig(config.appDirectory, config.appEnvironment);
    this.setServer(config.server);
    this.setAppDirectory(config.appDirectory);
    this.loadServerEngineMiddlewares_();

    this.setHost(this.getAppEnvironment().magnet.host);
    this.setPort(this.getAppEnvironment().magnet.port);
    this.setTestBehavior(this.getAppEnvironment().magnet.isTest);
  }

  /**
   * Gets application directory.
   * @return {string} Application directory.
   */
  getAppDirectory() {
    return this.appDirectory_;
  }

  /**
   * Gets application environment.
   * @return {Object} Application environment.
   */
  getAppEnvironment() {
    return this.environment_.app;
  }

  /**
   * Gets internal environment.
   * @return {Object} Internal environment
   * @protected
   */
  getInternalEnvironment() {
    return this.environment_.internal;
  }

  /**
   * Gets server hostname.
   * @return {string} Hostname.
   */
  getHost() {
    return this.host_;
  }

  /**
   * Gets server port.
   * @return {number} Port.
   */
  getPort() {
    return this.port_;
  }

  /**
   * Gets server manager.
   * @return {Server} Server manager.
   */
  getServer() {
    return this.server_;
  }

  /**
   * Gets start lifecycle function.
   * @return {Function} Start lifecycle function.
   */
  getStartLifecycle() {
    return this.startFn_;
  }

  /**
   * Gets test behavior.
   * @return {boolean} Test behavior.
   */
  getTestBehavior() {
    return this.isTest_;
  }

  /**
   * Loads app directories into magnet scope.
   * @protected
   */
  async loadApplication() {
    logger.info('[APP]', 'Loading middlewares');

    const magnetConfig = this.getAppEnvironment().magnet;
    const wizardConfig = this.getInternalEnvironment().wizard;
    const wizard = new Wizard(wizardConfig);

    if (magnetConfig.injectionFiles.length > 0) {
      magnetConfig.injectionFiles.forEach((glob) => {
        wizard.inject(glob);
      });
    }

    if (magnetConfig.exclusionFiles.length > 0) {
      magnetConfig.exclusionFiles.forEach((glob) => {
        wizard.exclude(glob);
      });
    }

    await wizard.into(this.scope, this.getServer().getEngine(), this);
  }

  /**
   * Loads body parser applying url encoded system and json configuration.
   * @private
   */
  loadBodyParser_() {
    this.getServer()
      .getEngine()
      .use(bodyParser.urlencoded({extended: false}));

    this.getServer()
      .getEngine()
      .use(bodyParser.json({type: '*/*'}));
  }

  /**
   * Loads compression system.
   * @private
   */
  loadCompression_() {
    this.getServer()
      .getEngine()
      .use(compression());
  }

  /**
   * Loads engine dependencies.
   * @private
   */
  loadServerEngineMiddlewares_() {
    this.loadBodyParser_();
    this.loadCompression_();
    this.loadErrorMiddleware_();
    this.loadHttpLogger_();
    this.loadSecurity_();
    this.loadStaticFiles_();
  }

  /**
   * Setup general error middleware.
   * @private
   */
  loadErrorMiddleware_() {
    this.getServer()
      .getEngine()
      .use(errorMiddleware());
  }

  /**
   * Loads http logger.
   * @private
   */
  loadHttpLogger_() {
    this.getServer()
      .getEngine()
      .use(morgan('common'));
  }

  /**
   * Loads protection rules.
   * @private
   */
  loadSecurity_() {
    this.getServer()
      .getEngine()
      .use(helmet());
  }

  /**
   * Loads static files on engine.
   * @private
   */
  loadStaticFiles_() {
    this.getServer()
      .getEngine()
      .use('/static', express.static(
        path.join(this.getAppDirectory(), 'static')));
  }

  /**
   * Maybe execute start lifecycle function.
   * @private
   */
  maybeCallStartHook_() {
    if (isFunction(this.getStartLifecycle())) {
      this.getStartLifecycle().call(this, this);
    }
  }

  /**
   * Sets application directory.
   * @param {string} appDirectory Application directory.
   */
  setAppDirectory(appDirectory) {
    this.appDirectory_ = appDirectory;
  }

  /**
   * Loads application and starts http server.
   */
  async start() {
    this.maybeCallStartHook_();

    await this.loadApplication();

    await new Promise((resolve, reject) => {
      this.getServer()
          .getHttpServer()
          .on('error', reject);
      this.getServer()
          .getHttpServer()
          .on('listening', () => resolve());
      this.getServer()
          .listen(this.getPort(), this.getHost());
    });
  }

  /**
   * Stops application.
   */
  async stop() {
    logger.info('[APP]', 'Shutting down gracefully.');

    await this.getServer().close();

    logger.info('[SERVER]', 'Closed out remaining connections.');
  }

  /**
   * Sets hostname.
   * @param {string} host Hostname.
   */
  setHost(host) {
    this.host_ = host;
  }

  /**
   * Sets server manager.
   * @param {Server} server Server manager.
   */
  setServer(server) {
    this.server_ = server;
  }

  /**
   * Sets server port.
   * @param {number} port Server port.
   */
  setPort(port) {
    this.port_ = port;
  }

  /**
   * Sets start lifecycle function.
   * @param {function} fn Start lifecycle function.
   */
  setStartLifecycle(fn) {
    this.startFn_ = fn;
  }

  /**
   * Sets test behavior.
   * @param {boolean} isTest Test behavior.
   */
  setTestBehavior(isTest) {
    this.isTest_ = isTest;
  }
}

export default Magnet;
