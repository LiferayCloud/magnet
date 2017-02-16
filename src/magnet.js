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
 * Main class.
 */
class Magnet {

  /**
   * Constructor.
   * @param  {object} config
   */
  constructor(config) {
    assertDefAndNotNull(config, 'The config param is required');
    assertDefAndNotNull(config.server, 'The server param is required');
    assertDefAndNotNull(config.appDirectory,
      'The appDirectory param is required');
    assertDefAndNotNull(config.appEnvironment,
      'The appEnvironment param is required');

    this.environment_ = loadConfig(config.appDirectory, config.appEnvironment);

    this.setServer(config.server);
    this.setAppDirectory(config.appDirectory);
    this.loadServerEngineMiddlewares_();

    this.setHost(this.getAppEnvironment().magnet.host);
    this.setPort(this.getAppEnvironment().magnet.port);
    this.setTestBehavior(this.getAppEnvironment().magnet.isTest);

    /**
     * Scope that receives dependency injections from scanned files.
     * @type {object}
     */
    this.scope = {};
  }

  /**
   * Get app directory.
   * @return {string} application directory.
   */
  getAppDirectory() {
    return this.appDirectory;
  }

  /**
   * Get app environment
   * @return {object}
   */
  getAppEnvironment() {
    return this.environment_.app;
  }

  /**
   * Get internal environment
   * @return {object}
   * @protected
   */
  getInternalEnvironment() {
    return this.environment_.internal;
  }

  /**
   * Get host.
   * @return {string} Host.
   */
  getHost() {
    return this.host_;
  }

  /**
   * Get port.
   * @return {string} Port.
   */
  getPort() {
    return this.port_;
  }

  /**
   * Get server.
   * @return {object} express http server.
   */
  getServer() {
    return this.server_;
  }

  /**
   * Get start lifecycle function.
   * @return {function}
   */
  getStartLifecycle() {
    return this.startFn_;
  }

  /**
   * Get test behavior.
   * @return {boolean} Test behavior.
   */
  getTestBehavior() {
    return this.isTest_;
  }

  /**
   * Loads app directories into the engine.
   * @param  {Magnet} instance
   * @return {Magnet}
   * @protected
   */
  async loadApplication() {
    logger.info('[APP]', 'Loading middlewares');

    return new Promise(async (resolve, reject) => {
    try {
      let magnetConfig = this.getAppEnvironment().magnet;
      let wizardConfig = this.getInternalEnvironment().wizard;

        let wizard = new Wizard(expressConfig.wizard);

        if (wizardConfig.injectionFiles.length > 0) {
          magnetConfig.injectionFiles.forEach((glob) => {
            wizard.inject(glob);
          });
        }

        if (magnetConfig.exclusionFiles.length > 0) {
          magnetConfig.exclusionFiles.forEach((glob) => {
            wizard.exclude(glob);
          });
        }

        await wizard.into(this.getServer().getEngine(), this);
      } catch(e) {
        reject(e);
      }
      resolve();
    });
  }

  /**
   * Loads body parser.
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
   * Load compression system.
   */
  loadCompression_() {
    this.getServer()
      .getEngine()
      .use(compression());
  }

  /**
   * Load engine dependencies.
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
   */
  loadErrorMiddleware_() {
    this.getServer()
      .getEngine()
      .use(errorMiddleware());
  }

  /**
   * Loads http logger.
   */
  loadHttpLogger_() {
    this.getServer()
      .getEngine()
      .use(morgan('common'));
  }

  /**
   * Loads protection rules.
   */
  loadSecurity_() {
    this.getServer()
      .getEngine()
      .use(helmet());
  }

  /**
   * Load static files on engine.
   */
  loadStaticFiles_() {
    this.getServer()
      .getEngine()
      .use('/static', express.static(
        path.join(this.getAppDirectory(), 'static')));
  }

  /**
   * Maybe execute start hook.
   */
  maybeCallStartHook_() {
    if (isFunction(this.getStartLifecycle())) {
      this.getStartLifecycle().call(this, this);
    }
  }

  /**
   * Set app directory.
   * @param {string} appDirectory
   */
  setAppDirectory(appDirectory) {
    this.appDirectory = appDirectory;
  }

  /**
   * Starts application.
   * @param {Magnet} instance
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
   * Set host.
   * @param {string} host
   */
  setHost(host) {
    this.host_ = host;
  }

  /**
   * Set Http server.
   * @param {Server} server
   */
  setServer(server) {
    this.server_ = server;
  }

  /**
   * Set port.
   * @param {string} port
   */
  setPort(port) {
    this.port_ = port;
  }

  /**
   * Set start lifecycle function.
   * @param {function} fn
   */
  setStartLifecycle(fn) {
    this.startFn_ = fn;
  }

  /**
   * Set test behavior.
   * @param {boolean} isTest
   */
  setTestBehavior(isTest) {
    this.isTest_ = isTest;
  }

}

export default Magnet;
