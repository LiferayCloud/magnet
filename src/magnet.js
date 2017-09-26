import {assertDefAndNotNull} from 'metal-assertions';
import {buildClient} from './build/client';
import {buildServer} from './build/server';
import {createConfig} from './config';
import {errorMiddleware} from './middleware/error';
import {isFunction, isString} from 'metal';
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
import resolve from 'resolve';
import ServerFactory from './server-factory';
import webpackConfig from './build/webpack.config';

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
    assertDefAndNotNull(
      options,
      `Magnet options are required, ` +
        `try: new Magnet({directory: \'/app\'}).`
    );
    assertDefAndNotNull(
      options.directory,
      `Magnet directory is required, ` +
        `try: new Magnet({directory: \'/app\'}).`
    );

    /**
     * Configuration object.
     * @type {!object}
     * @protected
     */
    this.config = this.resolveConfig(
      options.directory,
      options.config,
      options.configDir
    );

    /**
     * Sync log level to the one set on this instance.
     * @type {!string}
     * @protected
     */
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

    /**
     * Magnet plugins.
     * @type {!Array}
     * @private
     */
    this.plugins_ = [];

    this.setupMiddlewares_();
    this.setupApplicationSettings_();
    this.registerWebpackConfig_();
    this.registerPlugins_();
  }

  /**
   * Adds plugin.
   * @param {Object} plugin
   */
  addPlugin(plugin) {
    this.plugins_.push(plugin);
  }

  /**
   * Builds application.
   */
  async build() {
    await buildClient(this);

    const files = this.getBuildFiles({directory: this.getDirectory()});
    if (!files.length) {
      return;
    }

    await buildServer(
      files,
      this.getDirectory(),
      this.getServerDistDirectory(),
      this.getPlugins()
    );
  }

  /**
   * Gets config.
   * @return {Object}
   */
  getConfig() {
    return this.config;
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
   * @param {!string} directory
   * @param {?boolean} realpath Whether should return the files real path.
   * @param {?array.<string>} src
   * @param {?array.<string>} ignore
   * @return {array.<string>} Array of file paths.
   */
  getFiles({
    directory,
    realpath = false,
    src = this.config.magnet.src,
    ignore = this.config.magnet.ignore,
  }) {
    let files = [];
    src.forEach(pattern => {
      files = files.concat(
        glob.sync(pattern, {cwd: directory, ignore: ignore, realpath: realpath})
      );
    });
    if (!realpath) {
      // Normalize globs of relative paths to start with './'.
      files = files.map(file => {
        if (path.isAbsolute(file)) {
          return file;
        }
        return '.' + path.sep + path.join(file);
      });
    }
    return [...new Set(files)];
  }

  /**
   * Scans files that matches with `config.magnet.src` globs.
   * excluding `config.magnet.ignore`, start.js and stop.js.
   * @return {Array.<string>} Array of file paths.
   */
  getLoadFiles() {
    const directory = this.getServerDistDirectory();
    return this.getFiles({directory, realpath: true}).filter(function(item) {
      switch (item) {
        case path.join(directory, Magnet.LifecyleFiles.START):
        case path.join(directory, Magnet.LifecyleFiles.STOP):
          return false;
        default:
          return true;
      }
    });
  }

  /**
   * Scans files that matches with `config.magnet.src` globs.
   * excluding `config.magnet.ignore`, adding start.js and stop.js.
   * @return {Array.<string>} Array of file paths.
   */
  getBuildFiles() {
    const directory = this.getDirectory();
    const src = this.config.magnet.src.concat([
      Magnet.LifecyleFiles.START,
      Magnet.LifecyleFiles.STOP,
    ]);
    return this.getFiles({directory, src});
  }

  /**
   * Returns magnet plugins.
   * @return {Array.<Object>}
   * @protected
   */
  getPlugins() {
    return this.plugins_;
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
   * Gets static files dist directory.
   * @return {string}
   */
  getStaticDistDirectory() {
    return path.join(this.directory_, 'static');
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
   * Loads application.
   * @protected
   */
  async load() {
    let dist = this.getServerDistDirectory();
    let files = this.getLoadFiles({directory: dist, realpath: true});

    for (const file of files) {
      let module = require(file);
      try {
        for (const plugin of this.getPlugins()) {
          if (plugin.test(module, file, this)) {
            plugin.register(module, file, this);
            break;
          }
        }
      } catch (error) {
        log.error(false, error);
      }
    }
  }

  /**
   * Maybe run lifecycle file.
   * @param {!string} lifecycleFile
   * @private
   */
  async maybeRunLifecycleFile_(lifecycleFile) {
    let file = path.resolve(this.getServerDistDirectory(), lifecycleFile);
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
   * Register magnet plugins.
   * @private
   */
  registerPlugins_() {
    const config = this.getConfig();
    const pluginPrefix = 'magnet-plugin-';

    for (let plugin of config.magnet.plugins) {
      if (isString(plugin)) {
        const resolvedPath = resolve.sync(`${pluginPrefix}${plugin}`, {
          basedir: process.cwd(),
        });
        plugin = require(resolvedPath);
      }

      if (plugin.default) {
        plugin = plugin.default;
      }
      this.addPlugin(plugin);
    }
  }

  /**
   * Resolves configuration using environment `NODE_ENV` or the specified
   * `config` filename. Note that the configuration directory can be specified
   * as `configDir`.
   * @param {!string} directory
   * @param {?string=} config Optional config filename.
   * @param {?string=} configDir Optional config directory.
   * @return {Object} Configuration object.
   * @protected
   */
  resolveConfig(directory, config, configDir = '') {
    let lookupConfig = config;
    // Try loading config from environment...
    if (!lookupConfig) {
      let envConfig = `magnet.${process.env.NODE_ENV}.config.js`;
      if (fs.existsSync(path.resolve(directory, configDir, envConfig))) {
        lookupConfig = envConfig;
      }
    }
    // If still not found, try loading default filename.
    if (!lookupConfig) {
      lookupConfig = 'magnet.config.js';
    }
    log.info(false, 'Config ' + lookupConfig);
    return createConfig(directory, lookupConfig, configDir);
  }

  /**
   * Setup body parser middleware.
   * @private
   */
  setupMiddlewareBodyParser_() {
    this.getServer().getEngine().use(bodyParser.urlencoded({extended: false}));

    this.getServer().getEngine().use(bodyParser.json());
  }

  /**
   * Setup compression middleware.
   * @private
   */
  setupMiddlewareCompression_() {
    this.getServer().getEngine().use(compression());
  }

  /**
   * Setup error middleware.
   * @private
   */
  setupMiddlewareError_() {
    this.getServer().getEngine().use(validatorErrorMiddleware());
    this.getServer().getEngine().use(errorMiddleware());
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
    this.getServer().getEngine().use(morgan('tiny'));
  }

  /**
   * Setup multipart form data parser middleware.
   * @private
   */
  setupMiddlewareMultipart_() {
    this.getServer().getEngine().use(multer().any());
  }

  /**
   * Setup validator middleware.
   * @private
   */
  setupMiddlewareValidator_() {
    this.getServer().getEngine().use(
      expressValidator({
        customValidators: {
          custom: function(value, fn) {
            return fn(value);
          },
        },
        errorFormatter: (param, msg, value) => {
          return {
            reason: msg,
            context: {
              param: param,
              value: value,
            },
          };
        },
      })
    );
  }

  /**
   * Setup engine application settings.
   * @private
   */
  setupApplicationSettings_() {
    this.getServer().getEngine().set('trust proxy', true);
  }

  /**
   * Setup engine middleware.
   * @private
   */
  setupMiddlewares_() {
    if (this.getConfig().magnet.dev) {
      this.setupMiddlewareDevelopment_();
    }
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
    this.getServer().getEngine().use(helmet());
  }

  /**
   * Setup development middleware.
   * @private
   */
  setupMiddlewareDevelopment_() {
    this.getServer().getEngine().use((req, res, next) => {
      res.set('Connection', 'close');
      next();
    });
  }

  /**
   * Setup static files middleware.
   * @private
   */
  setupMiddlewareStaticFiles_() {
    this.getServer()
      .getEngine()
      .use('/static', express.static(this.getStaticDistDirectory()));
  }

  /**
   * Register default webpack config.
   */
  registerWebpackConfig_() {
    this.webpackConfig = webpackConfig(this);
  }

  /**
   * Starts plugins by calling their `start` method.
   * @private
   */
  async startPlugins() {
    log.info(false, 'Starting plugins…');

    try {
      for (const plugin of this.getPlugins()) {
        if (isFunction(plugin.start)) {
          await plugin.start(this);
        }
      }
    } catch (error) {
      log.error(false, error);
    }
  }

  /**
   * Starts application.
   */
  async start() {
    this.maybeRunLifecycleFile_(Magnet.LifecyleFiles.START);

    await this.startPlugins();
    await this.load();

    this.setupMiddlewareError_();

    await new Promise((resolve, reject) => {
      this.getServer().getHttpServer().on('error', reject);
      this.getServer()
        .setPort(this.config.magnet.port)
        .setHost(this.config.magnet.host)
        .getHttpServer()
        .on('listening', () => resolve());
      this.getServer().listen();
    });
  }

  /**
   * Stops application.
   */
  async stop() {
    log.info(false, 'Shutting down gracefully…');
    this.maybeRunLifecycleFile_(Magnet.LifecyleFiles.STOP);
    await this.getServer().close();
  }
}

/**
 * Magnet lifecycle files.
 * @static
 * @enum {string}
 */
Magnet.LifecyleFiles = {
  START: 'start.js',
  STOP: 'stop.js',
};

export default Magnet;
