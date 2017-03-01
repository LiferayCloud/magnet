import {assertDefAndNotNull} from './assertions';
import {build} from './build/build';
import {createConfig} from './config';
import {errorMiddleware} from './middleware/error';
import {isFunction} from 'metal';
import {validatorErrorMiddleware} from './middleware/validator-error';
import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import expressValidator from 'express-validator';
import fs from 'fs-extra';
import glob from 'glob';
import helmet from 'helmet';
import log from './log';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import registratorFunction from './registrator/function';
import registratorMultiple from './registrator/multiple';
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
     * Default server runtime used to handle http requests.
     * @type {!Server}
     * @private
     */
    this.server_ = ServerFactory.create();

    this.setupMiddlewares_();
  }

  /**
   * Builds application.
   * @param {boolean} logBuildOutput
   */
  async build() {
    // Include lifecycle files on build.
    let src = this.config.magnet.src.concat([
      Magnet.LifecyleFiles.START,
    ]);

    let files = this.getFiles({directory: this.getDirectory(), src: src});

    if (!files.length) {
      return;
    }

    log.info(false, 'Building assets…');

    await build(files, this.getDirectory(), this.getServerDistDirectory());
  }

  /**
   * Gets directory.
   * @return {string}
   */
  getDirectory() {
    return this.directory_;
  }

  /**
   * Scans files that matches with `config.magnet.src` globs.
   * excluding `config.magnet.ignore`.
   * @param {!String} directory
   * @param {?boolean} realpath Whether should return the files real path.
   * @param {?array.<String>} src
   * @param {?array.<String>} ignore
   * @return {array.<string>} Array of file paths.
   */
  getFiles({
    directory,
    realpath = false,
    src = this.config.magnet.src,
    ignore = this.config.magnet.ignore,
  }) {
    let files = [];
    src.forEach((pattern) => {
      files = files.concat(
        glob.sync(
          pattern, {cwd: directory, ignore: ignore, realpath: realpath}));
    });
    if (!realpath) {
      // Normalize globs of relative paths to start with './'.
      return files.map((file) => {
        if (path.isAbsolute(file)) {
          return file;
        }
        return '.' + path.sep + path.join(file);
      });
    }
    return [...new Set(files)];
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
    } catch(error) {
      return false;
    }
  }

  /**
   * Loads application.
   * @protected
   */
  async load() {
    let dist = this.getServerDistDirectory();
    let files = this.getFiles({directory: dist, realpath: true});
    files.forEach((file) => {
      let module = require(file);
      try {
        if (registratorFunction.test(module, file, this)) {
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
   * Maybe run lifecycle file.
   * @param {!String} lifecycleFile
   * @private
   */
  async maybeRunLifecycleFile_(lifecycleFile) {
    let file = path.resolve(
      this.getServerDistDirectory(), lifecycleFile);
    if (fs.existsSync(file)) {
      let fn = require(file);
      if (fn.default) {
        fn = fn.default;
      }
      if (isFunction(fn)) {
        let app = this.getServer().getEngine();
        fn.call(this, app, this);
      }
    }
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

  /**
   * Starts application.
   */
  async start() {
    this.maybeRunLifecycleFile_(Magnet.LifecyleFiles.START);

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
    fs.removeSync(this.getServerDistDirectory());
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
