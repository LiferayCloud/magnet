import {build} from '../../../src/build/build';
import {existsSync} from 'fs';
import del from 'del';
import Magnet from '../../../src/magnet';
import path from 'path';

describe('.build', function() {
  const directory = `${process.cwd()}/test/fixtures/build`;

  it('should build the specified app directory', async() => {
    const magnet = new Magnet({directory});
    const serverDist = path.join(directory, '.magnet');
    await build(magnet.getFiles(directory), directory, serverDist);
    expect(existsSync(serverDist)).to.be.true;
    await del(serverDist);
  });

  it('should build the files inside the specified app directory', async() => {
    const magnet = new Magnet({directory});
    const serverDist = path.join(directory, '.magnet');
    await build(magnet.getFiles(directory), directory, serverDist);
    expect(existsSync(path.join(serverDist, 'one.js'))).to.be.true;
    expect(existsSync(path.join(serverDist, 'two.js'))).to.be.true;
    await del(serverDist);
  });

  it('should clean dist directory before build');

  it('should inform the user that the app doesn\'t have javascript files to register'); // eslint-disable-line max-len

  it('should not build anything from assets folder, and instead just copy the file'); // eslint-disable-line max-len
});
