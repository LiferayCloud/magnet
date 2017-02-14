import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import logger from 'winston';
import morgan from 'morgan';
import path from 'path';
import Wizard from 'express-wizard';
import ExpressEngine from './server/express-engine';
import {assertDefAndNotNull} from './assertions';
import {errorMiddleware} from './middleware/general-errors';
import Server from './server/server';
import {loadConfig} from './config';

/**
 * Main class.
 */
class Magnet {

  /**
   * Constructor.
   * @param  {Object} config
   */
  constructor(config) {
    assertDefAndNotNull(config, 'The config param is required');
    assertDefAndNotNull(config.appDirectory, 'Specify app directory');
    assertDefAndNotNull(config.serverEngine, 'Specify server engine');
    assertDefAndNotNull(config.appEnvironment, 'Specify app environment');

    this.environment_ = loadConfig(config.appDirectory, config.appEnvironment);

    this.setAppDirectory(config.appDirectory);
    this.setHost(this.getAppEnvironment().magnet.host);
    this.setPort(this.getAppEnvironment().magnet.port);
    this.setServerEngine(config.serverEngine);
    this.setTestBehavior(this.getAppEnvironment().magnet.isTest);
  }

  /**
   * Get app directory.
   * @return {String} application directory.
   */
  getAppDirectory() {
    return this.appDirectory;
  }

  /**
   * Get app environment
   * @return {Object}
   */
  getAppEnvironment() {
    return this.environment_.app;
  }

  /**
   * Get internal environment
   * @return {Object}
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
   * @return {Object} express http server.
   */
  getServer() {
    return this.server_;
  }

  /**
   * Gets server engine.
   * @return {Express} Express instance.
   */
  getServerEngine() {
    return this.serverEngine_;
  }

  /**
   * Get start lifecycle function.
   * @return {Function}
   */
  getStartLifecycle() {
    return this.startFn_;
  }

  /**
   * Get stop lifecycle function.
   * @return {Function}
   */
  getStopLifecycle() {
    return this.stopFn_;
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
    logger.info('[APP]', 'Loading middlewares, models and routes');

    try {
      let magnetConfig = this.getAppEnvironment().magnet;
      let expressConfig = this.getInternalEnvironment().express;

      let wizard = new Wizard(expressConfig.wizard);

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

      await wizard.into(this.getServerEngine().getEngine(), this);
    } catch(e) {
      logger.error(e);
    }

    return this;
  }

  /**
   * Loads body parser.
   * @return {Magnet}
   */
  loadBodyParser_() {
    this.getServerEngine()
      .getEngine()
      .use(bodyParser.urlencoded({extended: false}));

    this.getServerEngine()
      .getEngine()
      .use(bodyParser.json({type: '*/*'}));

    return this;
  }

  /**
   * Load compression system.
   * @return {Magnet}
   */
  loadCompression_() {
    this.getServerEngine()
      .getEngine()
      .use(compression());
    return this;
  }

  /**
   * Load engine dependencies.
   * @param  {Magnet} instance
   * @return {Magnet}
   */
  loadEngineMiddlewares_() {
    this.loadHttpLogger_()
      .loadBodyParser_()
      .loadSecurity_()
      .loadCompression_()
      .loadStaticFiles_();

    return this;
  }

  /**
   * Setup general error middleware.
   * @return {Magnet}
   */
  loadGeneralErrorMiddleware_() {
    logger.info('[APP]', 'Configuring error handler');
    const engine = this.getServerEngine().getEngine();
    engine.use(errorMiddleware());
    return this;
  }

  /**
   * Loads http logger.
   * @return {Magnet}
   */
  loadHttpLogger_() {
    this.getServerEngine()
      .getEngine()
      .use(morgan('common'));

    return this;
  }

  /**
   * Loads protection rules.
   * @return {Magnet}
   */
  loadSecurity_() {
    this.getServerEngine()
      .getEngine()
      .use(helmet());

    return this;
  }

  /**
   * Load static files on engine.
   * @return {Magnet}
   */
  loadStaticFiles_() {
    this.getServerEngine()
      .getEngine()
      .use('/static', express.static(
        path.join(this.getAppDirectory(), 'static')));

    return this;
  }

  /**
   * Maybe execute start hook.
   * @return {Magnet}
   */
  maybeCallStartHook_() {
    if (typeof(this.getStartLifecycle()) === 'function') {
      this.getStartLifecycle().call(this, this);
    }

    return this;
  }

  /**
   * Maybe execute stop hook.
   * @return {Magnet}
   */
  maybeCallStopHook_() {
    if (typeof(this.getStopLifecycle()) === 'function') {
      this.getStopLifecycle().call(this, this);
    }

    return this;
  }

  /**
   * Set app directory.
   * @param {string} appDirectory
   */
  setAppDirectory(appDirectory) {
    this.appDirectory = appDirectory;
  }

  /**
   * Setup application.
   * @return {Magnet}
   */
  async setupApplication() {
    try {
      this.loadEngineMiddlewares_()
        .maybeCallStartHook_();

      await this.loadApplication();

      this.loadGeneralErrorMiddleware_();

      return this;
    } catch(e) {
      logger.error(e);
    }
  }

  /**
   * Starts application.
   * @param {Magnet} instance
   */
  async start(instance) {
    const engine = instance.getServerEngine()
                          .getEngine();

    instance.setServer(engine);

    await new Promise((resolve, reject) => {
      // This code catches EADDRINUSE error if the port is already in use
      instance.getServer()
          .getHttpServer()
          .on('error', reject);
      instance.getServer()
          .getHttpServer()
          .on('listening', () => resolve());
      instance.getServer()
          .listen(instance.getPort(), instance.getHost());
    });
  }

  /**
   * Stops application.
   */
  stop() {
    logger.info('[APP]', 'Received kill signal, shutting down gracefully.');

    this.maybeCallStopHook_();

    this
      .getServer()
      .close(() => {
        logger.info('[SERVER]', 'Closed out remaining connections.');
      });
  }

  /**
   * Set engine.
   * @param {Object} engine
   */
  setServerEngine(engine) {
    this.serverEngine_ = engine;
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
   * @param {Object} engine
   */
  setServer(engine) {
    this.server_ = new Server(engine);
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
   * @param {Function} fn
   */
  setStartLifecycle(fn) {
    this.startFn_ = fn;
  }

  /**
   * Set stop lifecycle function.
   * @param {Function} fn
   */
  setStopLifecycle(fn) {
    this.stopFn_ = fn;
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
export {Magnet, ExpressEngine};
