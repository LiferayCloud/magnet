import {buildServer} from '../../../src/build/server';
import {createConfig} from '../../../src/config';
import fs from 'fs-extra';
import Magnet from '../../../src/magnet';
import path from 'path';

describe('.build', function() {
  const directory = `${process.cwd()}/test/fixtures/build`;
  let magnet = null;
  let serverDist = null;

  beforeEach(() => {
    magnet = new Magnet({directory});
    serverDist = path.join(directory, '.magnet');
  });

  afterEach(() => {
    fs.removeSync(serverDist);
  });

  test('builds the specified app directory', async () => {
    await buildServer(magnet.getFiles({directory}), directory, serverDist);
    expect(fs.existsSync(serverDist)).toBeTruthy();
  });

  test('builds the files inside the specified app directory', async () => {
    await buildServer(magnet.getFiles({directory}), directory, serverDist);
    expect(fs.existsSync(path.join(serverDist, 'one.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(serverDist, 'two.js'))).toBeTruthy();
  });

  test('cleans dist directory before build', async () => {
    if (!fs.existsSync(serverDist)) {
      fs.mkdirpSync(serverDist);
    }
    const mockedFile = path.join(serverDist, 'testfile');
    if (!fs.existsSync(mockedFile)) {
      fs.outputFileSync(mockedFile, 'testfile content');
    }
    expect(fs.existsSync(mockedFile)).toBeTruthy();
    await buildServer(magnet.getFiles({directory}), directory, serverDist);
    expect(fs.existsSync(mockedFile)).toBeFalsy();
  });

  test('set envrionment variable API_ONLY to true', async() => {
    expect(process.env.API_ONLY).toBeUndefined();
    const directory = `${process.cwd()}/test/fixtures/config`;
    const config = 'magnet.api.only.config.js';
    const magnet = new Magnet({config, directory});
    await magnet.build();
    expect(process.env.API_ONLY).toBeDefined();
    expect(process.env.API_ONLY).toBeTruthy();
  });
  
  test('do not set envrionment variable API_ONLY if is not on conifg', async() => {
    expect(process.env.API_ONLY).toBeUndefined();
    const directory = `${process.cwd()}/test/fixtures/config`;
    const config = 'magnet.config.js';
    const magnet = new Magnet({config, directory});
    await magnet.build();
    expect(process.env.API_ONLY).toBeUndefined();
  });
});
