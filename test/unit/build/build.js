import {build} from '../../../src/build/build';
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

  it('should build the specified app directory', async() => {
    await build(magnet.getFiles({directory}), directory, serverDist);
    expect(fs.existsSync(serverDist)).to.be.true;
  });

  it('should build the files inside the specified app directory', async() => {
    await build(magnet.getFiles({directory}), directory, serverDist);
    expect(fs.existsSync(path.join(serverDist, 'one.js'))).to.be.true;
    expect(fs.existsSync(path.join(serverDist, 'two.js'))).to.be.true;
  });

  it('should clean dist directory before build', async() => {
    if(!fs.existsSync(serverDist)) {
      fs.mkdirpSync(serverDist);
    }
    const mockedFile = path.join(serverDist, 'testfile');
    if(!fs.existsSync(mockedFile)) {
      fs.outputFileSync(mockedFile, 'testfile content');
    }
    expect(fs.existsSync(mockedFile)).to.be.true;
    await build(magnet.getFiles({directory}), directory, serverDist);
    expect(fs.existsSync(mockedFile)).to.be.false;
  });
});
