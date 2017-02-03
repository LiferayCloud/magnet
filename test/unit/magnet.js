import Magnet from '../../src/magnet';
import ExpressEngine from '../../src/server/express-engine';
import {existsSync} from 'fs';
import path from 'path';

describe('magnet', function() {
	it('should do what...', async () => {
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
      const startFn = require(path.join(appDirectory, 'start.js'));
      magnet.setStartLifecycle(startFn);
    }

    if (existsSync(path.join(appDirectory, 'stop.js'))) {
      const stopFn = require(path.join(appDirectory, 'stop.js'));
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
