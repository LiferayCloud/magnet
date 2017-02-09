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

/**
 * Main class.
 */
class Magnet {

  /**
   * Constructor.
   * @param  {Object} config
   */
  constructor(config) {
    assertDefAndNotNull(config, 'The config param is required.');
    assertDefAndNotNull(config.appDirectory, 'Specify app directory.');
    assertDefAndNotNull(config.serverEngine, 'Specify server engine.');
    assertDefAndNotNull(config.appEnvironment, 'Specify app environment.');

    this.setDirectory(config.appDirectory);
    this.setServerEngine(config.serverEngine);
    this.loadEnvironment_(config.appEnvironment);
    this.setPort(this.getEnvironment().server.port);
    this.setHost(this.getEnvironment().server.host);
    this.setTestBehavior(this.getEnvironment().server.isTest);
  }

  /**
   * Start HTTP server.
   * @return {Magnet}
   */
  createHttpServer_() {
    const engine = this.getServerEngine()
                       .getEngine();

    this.setHttpServer(engine);

    return this;
  }

  /**
   * Get app environment
   * @return {Object}
   */
  getAppEnvironment() {
    return this.getEnvironment().appEnvironment;
  }

  /**
   * Get directory.
   * @return {String} application directory.
   */
  getDirectory() {
    return this.directory;
  }

  /**
   * Gets server engine.
   * @return {Express} Express instance.
   */
  getServerEngine() {
    return this.serverEngine_;
  }

  /**
   * Get environment.
   * @return {Object} environment.
   */
  getEnvironment() {
    return this.environment_;
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
   * Listens to port and host for http server.
   * @return {Magnet}
   */
  listen() {
    this.getServer()
        .listen(this.getPort(), this.getHost());

    return this;
  }

  /**
   * Loads app directories into the engine.
   * @param  {Magnet} instance
   * @return {Magnet}
   */
  async loadApplication_() {
    logger.info('[APP]', 'Loading middlewares, models and routes');

    try {
      let wizard = new Wizard(this.getEnvironment().express.wizard);

      if (this.getEnvironment().injectionFiles.length > 0) {
        this.getEnvironment().injectionFiles.forEach((stack) => {
          wizard = wizard.inject(stack);
        });
      } else {
        wizard = wizard.inject('**/*.js');
      }

      if (this.getEnvironment().exclusionFiles.length > 0) {
        this.getEnvironment().exclusionFiles.forEach((stack) => {
          wizard = wizard.exclude(stack);
        });
      } else {
        wizard = wizard.exclude('node_modules/**')
        .exclude('start.js')
        .exclude('stop.js')
        .exclude('dist/**')
        .exclude('build/**');
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
    this
      .getServerEngine()
      .getEngine()
      .use(bodyParser.urlencoded({extended: true}));

    this
      .getServerEngine()
      .getEngine()
      .use(bodyParser.json({type: '*/*'}));

    return this;
  }

  /**
   * Load compression system.
   * @return {Magnet}
   */
  loadCompression_() {
    this
      .getServerEngine()
      .getEngine()
      .use(compression());
    return this;
  }

  /**
   * Load engine dependencies.
   * @param  {Magnet} instance
   * @return {Magnet}
   */
  loadEngineDependencies_() {
    this.loadHttpLogger_()
      .loadBodyParser_()
      .loadSecurity_()
      .loadCompression_()
      .loadStaticFiles_();

    return this;
  }

  /**
   * Load environment from app.
   * @param {String} appEnv application environment variables.
   */
  loadEnvironment_(appEnv) {
    const env = require('./environment')(this.getDirectory(), appEnv);
    this.environment_ = env;
  }

  /**
   * Setup general error middeware.
   * @return {Magnet}
   */
  loadGeneralErrorMiddleware_() {
    logger.info('[APP]', 'Configuring error handler');
    const engine = this.getServerEngine().getEngine();
    engine.use(errorMiddleware(engine.get('env')));

    return this;
  }

  /**
   * Loads http logger.
   * @return {Magnet}
   */
  loadHttpLogger_() {
    this
      .getServerEngine()
      .getEngine()
      .use(morgan('common'));

    return this;
  }

  /**
   * Loads protection rules.
   * @return {Magnet}
   */
  loadSecurity_() {
    this
      .getServerEngine()
      .getEngine()
      .use(helmet());

    return this;
  }

  /**
   * Load static files on engine.
   * @return {Magnet}
   */
  loadStaticFiles_() {
    this
      .getServerEngine()
      .getEngine()
      .use('/static', express.static(path.join(this.getDirectory(), 'static')));

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
   * Setup application.
   * @return {Magnet}
   */
  async setupApplication() {
    try {
      this.loadEngineDependencies_()
        .maybeCallStartHook_();

      await this.loadApplication_();

      this.loadGeneralErrorMiddleware_();

      return this;
    } catch(e) {
      logger.error(e);
    }
  }

  /**
   * Starts application.
   * @param {Magnet} instance
   * @return {Magnet}
   */
  start(instance) {
    return instance.createHttpServer_();
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
   * Set directory.
   * @param {string} directory
   */
  setDirectory(directory) {
    this.directory = directory;
  }

  /**
   * Set environment.
   * @param {string} env
   */
  setEnvironment(env) {
    this.environment_ = env;
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
  setHttpServer(engine) {
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
