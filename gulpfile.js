const gulp = require('gulp');
const cache = require('gulp-cached');
const babel = require('gulp-babel');
const codecov = require('gulp-codecov');
const loadPlugins = require('gulp-load-plugins');
const eslint = require('gulp-eslint');
const notify_ = require('gulp-notify');

const path = require('path');
const fs = require('fs');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const manifest = require('./package.json');
const DeepMerge = require('deep-merge');
const isparta = require('isparta');
const mochaGlobals = require('./test/setup/.globals');
const $ = loadPlugins();

const release = process.env.NODE_ENV === 'production';
const Instrumenter = isparta.Instrumenter;
const babelOptions = JSON.parse(fs.readFileSync('.babelrc', 'utf-8'))
const deepmerge = DeepMerge(function(target, source, key) {
  if(target instanceof Array) {
    return [].concat(target, source);
  }
  return source;
});
const watchFiles = ['src/**/*', 'test/**/*'];
const lintWatchFiles = ['**/*.js', '!node_modules/**', '!coverage/**', '!gulpfile.js', '!build/**'];
const defaultConfig = {
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader','eslint-loader'] },
    ]
  },
  devtool: release ? '' : 'source-map',
};

const nodeModules = fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  });

const backendConfig = config_({
  entry: path.join(__dirname, '/src/magnet.js'),
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: `magnet.js`,
    libraryTarget: 'commonjs2'
  },
  node: {
    __dirname: true,
    __filename: true
  },
  externals: [
    function(context, request, callback) {
      const pathStart = request.split('/')[0];
      if (nodeModules.indexOf(pathStart) >= 0 ) {
        return callback(null, "commonjs " + request);
      };
      callback();
    }
  ],
  recordsPath: path.join(__dirname, 'build/_records'),
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin({banner:'require("source-map-support").install();', raw: true, entryOnly: false })
  ]
});

function config_(overrides) {
  return deepmerge(defaultConfig, overrides || {});
}

function registerBabel_() {
  require('babel-register');
}

function mocha_() {
  return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], {read: false})
    .pipe($.mocha({
      reporter: 'spec',
      globals: Object.keys(mochaGlobals.globals),
      ignoreLeaks: false
    }));
}

/**
 * On build callback.
 * @param  {Function} done
 * @return {Function}
 */
function onBuild_(done) {
  return function(err, stats) {
    if(err) {
      console.log('Error', err);
    }
    else {
      console.log(stats.toString());
    }

    if(done) {
      done();
    }
  }
}

/**
 * Test helper
 * @return {Function}
 */
function test() {
  registerBabel_();
  return mocha_();
}

gulp.task('build-bin', () => {
  return gulp.src('src/bin/*')
  .pipe(cache('bin'))
  .pipe(babel(babelOptions))
  .pipe(gulp.dest('build/bin'))
  .pipe(notify('Compiled binaries'));
});

gulp.task('build-backend', (done) => {
  webpack(backendConfig).run(onBuild_(done));
});

gulp.task('build', (done) => {
  runSequence(
    'build-bin',
    'build-backend',
    ['lint'],
    done
  );
});

gulp.task('watch-backend', function() {
  return gulp.watch('src/*', [
    'build-backend'
  ]);
});

gulp.task('watch-bin', () => {
  return gulp.watch('src/bin/*', [
    'build-bin'
  ]);
})

gulp.task('watch', ['watch-backend', 'watch-bin', 'lint']);

gulp.task('test:watch', () => {
  gulp.watch(watchFiles, ['coverage']);
});

gulp.task('test', test);

gulp.task('test:coverage:travis', () => {
  gulp.src('./coverage/lcov.info')
      .pipe(codecov());
});

gulp.task('coverage', (done) => {
  registerBabel_();
  gulp.src(['src/**/*.js'])
    .pipe($.istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe($.istanbul.hookRequire())
    .on('finish', () => {
      return test()
        .pipe($.istanbul.writeReports())
        .on('end', done);
    });
});

gulp.task('lint', () => {
    return gulp.src(lintWatchFiles)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('lint:watch', () => {
  gulp.watch(lintWatchFiles, ['lint']);
});

notify_.logLevel(0);

/**
 * Notification helper
 * @param  {string} msg
 * @return {Function}
 */
function notify(msg) {
  return notify_({
    title: '❂ Magnet',
    message: msg,
    icon: false,
    onLast: true
  });
}
