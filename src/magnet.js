import {assertDefAndNotNull} from './assertions';
import {build} from './build/build';
import {createConfig} from './config';
import {errorMiddleware} from './middleware/error';
import {isFunction} from 'metal';
import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import fs from 'fs';
import glob from 'glob';
import helmet from 'helmet';
import logger from 'winston';
import morgan from 'morgan';
import path from 'path';
import registratorDefault from './registrator/default';
import registratorInjection from './registrator/injection';
import registratorString from './registrator/string';
import ServerFactory from './server-factory';

/**
 * Magnet.
 */
class Magnet {

  /**
   * Constructor.
   */
  constructor({
    directory,
    config,
  }) {
    assertDefAndNotNull(directory, `Magnet directory is required,
      try: new Magnet({directory: \'/app\'}).`);

    /**
     * Configuration object.
     * @type {!object}
     * @protected
     */
    this.config = createConfig(directory, config);

    /**
     * Injections object.
     * @type {!object}
     * @protected
     */
    this.injections = {};

    /**
     * Directory to start magnet application.
     * @type {!string}
     * @private
     */
    this.directory_ = directory;

    /**
     * Default server runtime used to handle http requests.
     * @type {!Server}
     * @private
     */
    this.server_ = ServerFactory.create();

    this.setupMiddlewares_();
  }

  /**
   * Gets directory.
   * @return {string}
   */
  getDirectory() {
    return this.directory_;
  }

  /**
   * Gets server runtime.
   * @return {Server}
   */
  getServer() {
    return this.server_;
  }

  /**
   * Gets server dist directory.
   * @return {string}
   */
  getServerDistDirectory() {
    return path.join(this.directory_, '.magnet', 'server');
  }

  /**
   * Builds application.
   * @protected
   * @async
   */
  async build() {
    let files = this.getFiles(this.getDirectory());

    let output = await build(files, this.getServerDistDirectory());

    console.log(output);
  }

  /**
   * Loads application.
   * @protected
   * @async
   */
  async load() {
    let files = this.getFiles(this.getServerDistDirectory(), true);
    files.forEach((file) => {
      delete require.cache[file];
      let module = require(file);
      try {
        if (registratorInjection.test(file, module, this)) {
          registratorInjection.register(file, module, this);
        }
        if (registratorDefault.test(file, module, this)) {
          registratorDefault.register(file, module, this);
        }
        if (registratorString.test(file, module, this)) {
          registratorString.register(file, module, this);
        }
      } catch(error) {
        logger.error(error);
      }
    });
  }

  /**
   * Scans files that matches with `config.magnet.src` globs.
   * excluding `config.magnet.ignore`.
   * @param {!string} cwd
   * @param {?boolean} realpath Whether should return the files real path.
   * @return {array.<string>} Array of file paths.
   */
  getFiles(cwd, realpath = false) {
    let src = this.config.magnet.src;
    let ignore = this.config.magnet.ignore;
    let files = [];
    src.forEach((pattern) => {
      files = files.concat(
        glob.sync(pattern, {cwd: cwd, ignore: ignore, realpath: realpath}));
    });
    return files;
  }

  /**
   * Run start hook.
   * @private
   * @async
   */
  async runStartHook_() {
    let start = path.resolve(this.getServerDistDirectory(), 'start.js');
    if (fs.existsSync(start)) {
      const startFn = require(start);
      if (isFunction(startFn)) {
        startFn.call(this);
      }
    }
  }

  /**
   * Sets server runtime.
   * @param {Server} server
   */
  setServer(server) {
    this.server_ = server;
  }

  /**
   * Starts application.
   * @async
   */
  async start() {
    await this.build();
    this.runStartHook_();
    await this.load();

    await new Promise((resolve, reject) => {
      this.getServer()
          .getHttpServer()
          .on('error', reject);
      this.getServer()
          .getHttpServer()
          .on('listening', () => resolve());
      this.getServer().listen(this.config.magnet.port, this.config.magnet.host);
    });
  }

  /**
   * Stops application.
   * @async
   */
  async stop() {
    logger.info('[APP]', 'Shutting down gracefully');
    await this.getServer().close();
  }

  /**
   * Setup body parser middleware.
   * @private
   */
  setupMiddlewareBodyParser_() {
    this.getServer()
      .getEngine()
      .use(bodyParser.urlencoded({extended: false}));

    this.getServer()
      .getEngine()
      .use(bodyParser.json({type: '*/*'}));
  }

  /**
   * Setup compression middleware.
   * @private
   */
  setupMiddlewareCompression_() {
    this.getServer()
      .getEngine()
      .use(compression());
  }

  /**
   * Setup error middleware.
   * @private
   */
  setupMiddlewareError_() {
    this.getServer()
      .getEngine()
      .use(errorMiddleware());
  }

  /**
   * Setup http logger middleware.
   * @private
   */
  setupMiddlewareHttpLogger_() {
    this.getServer()
      .getEngine()
      .use(morgan('common'));
  }

  /**
   * Setup engine middleware.
   * @private
   */
  setupMiddlewares_() {
    this.setupMiddlewareBodyParser_();
    this.setupMiddlewareCompression_();
    this.setupMiddlewareError_();
    this.setupMiddlewareHttpLogger_();
    this.setupMiddlewareSecurity_();
    this.setupMiddlewareStaticFiles_();
  }

  /**
   * Setup security middleware.
   * @private
   */
  setupMiddlewareSecurity_() {
    this.getServer()
      .getEngine()
      .use(helmet());
  }

  /**
   * Setup static files middleware.
   * @private
   */
  setupMiddlewareStaticFiles_() {
    this.getServer()
      .getEngine()
      .use('/static', express.static(
        path.join(this.getDirectory(), 'static')));
  }
}

export default Magnet;
