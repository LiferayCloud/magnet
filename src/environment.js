import {buildAppConfig, defaultConfig} from './app-config';

module.exports = (appDirectory, appEnv) => {
  return buildAppConfig(defaultConfig, appEnv, appDirectory);
};
