import {build} from '../../../src/build/build';
import {existsSync, mkdirSync, writeFileSync} from 'fs';
import del from 'del';
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

  afterEach(async () => {
    await del(serverDist);
  });

  it('should build the specified app directory', async() => {
    await build(magnet.getFiles(directory), directory, serverDist);
    expect(existsSync(serverDist)).to.be.true;
  });

  it('should build the files inside the specified app directory', async() => {
    await build(magnet.getFiles(directory), directory, serverDist);
    expect(existsSync(path.join(serverDist, 'one.js'))).to.be.true;
    expect(existsSync(path.join(serverDist, 'two.js'))).to.be.true;
  });

  it('should clean dist directory before build', async() => {
    if(!existsSync(serverDist)) {
      mkdirSync(serverDist);
    }
    const mockedFile = path.join(serverDist, 'testfile');
    if(!existsSync(mockedFile)) {
      writeFileSync(mockedFile, 'testfile content');
    }
    expect(existsSync(mockedFile)).to.be.true;
    await build(magnet.getFiles(directory), directory, serverDist);
    expect(existsSync(mockedFile)).to.be.false;
  });

  it('should inform the user that the app doesn\'t have javascript files to register', (done) => { // eslint-disable-line max-len
    build([], directory, serverDist).catch((error) => {
      expect(error.name).to.equal('WebpackOptionsValidationError');
      done();
    });
  });
});
