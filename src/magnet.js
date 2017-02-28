import {assertDefAndNotNull} from './assertions';
import {build} from './build/build';
import {createConfig} from './config';
import {errorMiddleware} from './middleware/error';
import {isFunction} from 'metal';
import {validatorErrorMiddleware} from './middleware/validator-error';
import bodyParser from 'body-parser';
import compression from 'compression';
import del from 'del';
import express from 'express';
import expressValidator from 'express-validator';
import fs from 'fs';
import glob from 'glob';
import helmet from 'helmet';
import log from './log';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import registratorFunction from './registrator/function';
import registratorInjection from './registrator/injection';
import registratorMultiple from './registrator/multiple';
import registratorString from './registrator/string';
import ServerFactory from './server-factory';

/**
 * Magnet class that handle configuration, directory injection, and server.
 * @class
 */
class Magnet {

  /**
   * Constructor.
   * @param {!Object} options Magnet options.
   */
  constructor(options) {
    assertDefAndNotNull(options, `Magnet options are required, ` +
      `try: new Magnet({directory: \'/app\'}).`);
    assertDefAndNotNull(options.directory, `Magnet directory is required, ` +
      `try: new Magnet({directory: \'/app\'}).`);

    /**
     * Configuration object.
     * @type {!object}
     * @protected
     */
    this.config = createConfig(options.directory, options.config);

    // Sync log level to the one set on this instance.
    log.level = this.config.magnet.logLevel;

    /**
     * Directory to start magnet application.
     * @type {!string}
     * @private
     */
    this.directory_ = options.directory;

    /**
     * Injections object.
     * @type {!object}
     * @protected
     */
    this.injections = {};

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
   * Checks if server dist directory exists.
   * @return {boolean}
   */
  hasServerDistDirectory() {
    try {
      fs.accessSync(this.getServerDistDirectory());
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Builds application.
   * @param {boolean} logBuildOutput
   */
  async build(logBuildOutput = true) {
    let files = this.getFiles(this.getDirectory());

    if (!files.length) {
      return;
    }

    log.info(false, 'Building assets…');

    let output = await build(
      files, this.getDirectory(), this.getServerDistDirectory());

    if (logBuildOutput) {
      log.infoNoPrefix(false, `\n${output}`);
    }
  }

  /**
   * Loads application.
   * @protected
   */
  async load() {
    let dist = this.getServerDistDirectory();
    let files = this.getFiles(dist, true);
    files.forEach((file) => {
      // Skip loading registrator for lifecycle files
      switch (file) {
        case path.join(dist, Magnet.LifecyleFiles.START):
          return;
      }
      delete require.cache[file];
      let module = require(file);
      if (registratorInjection.test(module, file, this)) {
        registratorInjection.register(module, file, this);
      }
      try {
        if (registratorString.test(module, file, this)) {
          registratorString.register(module, file, this);
        } else if (registratorFunction.test(module, file, this)) {
          registratorFunction.register(module, file, this);
        } else if (registratorMultiple.test(module, file, this)) {
          registratorMultiple.register(module, file, this);
        }
      } catch(error) {
        log.error(false, error);
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
    if (!realpath) {
      // Normalizes globs of relative files to always start with "./".
      // Webpack gets confused when trying to resolve relative module files
      // without the path separator.
      return files.map((file) => {
        if (path.isAbsolute(file)) {
          return file;
        }
        return '.' + path.sep + path.join(file);
      });
    }
    return files;
  }

  /**
   * Maybe run start hook.
   * @private
   */
  async maybeRunStartHook_() {
    let start = path.resolve(
      this.getServerDistDirectory(), Magnet.LifecyleFiles.START);
    if (fs.existsSync(start)) {
      let startFn = require(start);
      if (startFn.default) {
        startFn = startFn.default;
      }
      if (isFunction(startFn)) {
        let app = this.getServer().getEngine();
        startFn.call(this, app, this);
      }
    }
  }

  /**
   * Starts application.
   */
  async start() {
    this.maybeRunStartHook_();

    await this.load();

    this.setupMiddlewareError_();

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
   */
  async stop() {
    log.info(false, 'Shutting down gracefully…');
    await this.getServer().close();
    del(this.getServerDistDirectory());
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
      .use(bodyParser.json());
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
      .use(validatorErrorMiddleware());
    this.getServer()
      .getEngine()
      .use(errorMiddleware());
  }

  /**
   * Setup http logger middleware.
   * @private
   */
  setupMiddlewareHttpLogger_() {
    switch (this.config.magnet.logLevel) {
      case 'silent':
        return;
    }
    this.getServer()
      .getEngine()
      .use(morgan('common'));
  }

  /**
   * Setup multipart form data parser middleware.
   * @private
   */
  setupMiddlewareMultipart_() {
    this.getServer()
      .getEngine()
      .use(multer().any());
  }

  /**
   * Setup validator middleware.
   * @private
   */
  setupMiddlewareValidator_() {
    this.getServer()
      .getEngine()
      .use(expressValidator({
        errorFormatter: (param, msg, value) => {
          return {
            reason: msg,
            context: {
              param: param,
              value: value,
            },
          };
        },
      }));
  }

  /**
   * Setup engine middleware.
   * @private
   */
  setupMiddlewares_() {
    this.setupMiddlewareSecurity_();
    this.setupMiddlewareBodyParser_();
    this.setupMiddlewareMultipart_();
    this.setupMiddlewareCompression_();
    this.setupMiddlewareHttpLogger_();
    this.setupMiddlewareValidator_();
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

/**
 * Mgnet lifecycle files.
 * @static
 * @enum {string}
 */
Magnet.LifecyleFiles = {
  START: 'start.js',
};

export default Magnet;
