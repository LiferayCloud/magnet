import Magnet from '../../src/magnet';
import ExpressEngine from '../../src/server/express-engine';
import {existsSync} from 'fs';
import path from 'path';

describe('magnet', function() {
	it('sandbox', async () => {
    // - External Env Var
    // Start using default file export
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    const {NODE_ENV} = process.env;
    const appDirectory = `${process.cwd()}/test/fixtures/fake_app`;

    const envPath = `${appDirectory}/environments/${NODE_ENV}.js`;
    const env = require(envPath).default;
    const engine = new ExpressEngine();

    const magnetConfig = {
      appEnvironment: env,
      appDirectory: appDirectory,
      serverEngine: engine,
    };

    const magnet = new Magnet(magnetConfig);

    // - External Start and Stop
    if (existsSync(path.join(appDirectory, 'start.js'))) {
      let startFn = require(path.join(appDirectory, 'start.js'));

      if (startFn.default) {
        startFn = startFn.default;
      }

      magnet.setStartLifecycle(startFn);
    }

    if (existsSync(path.join(appDirectory, 'stop.js'))) {
      let stopFn = require(path.join(appDirectory, 'stop.js'));

      if (stopFn.default) {
        stopFn = stopFn.default;
      }

      magnet.setStopLifecycle(stopFn);
    }

    magnet.setupApplication()
      // .then(magnet.start);
      .then(() => {
        // magnet.start(instance);
        // console.log(instance.getEngine().controllers.one.toString());
      });
	});
});
