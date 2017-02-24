import {build} from '../../../src/build/build';
import Magnet from '../../../src/magnet';
import path from 'path';
import del from 'del';
import {existsSync} from 'fs';

describe('.build', function() {
  const directory = `${process.cwd()}/test/fixtures/build_app`;

  it('should build the specified app directory', async() => {
    const magnet = new Magnet({directory});
    const outputDirectory = path.join(directory, '.magnet');
    await build(magnet.getFiles(directory), directory, outputDirectory);

    expect(existsSync(outputDirectory)).to.be.true;

    await del(outputDirectory);
  });

  it('should build the files inside the specified app directory', async() => {
    const magnet = new Magnet({directory});
    const outputDirectory = path.join(directory, '.magnet');
    await build(magnet.getFiles(directory), directory, outputDirectory);

    expect(existsSync(path.join(outputDirectory, 'one.js'))).to.be.true;
    expect(existsSync(path.join(outputDirectory, 'two.js'))).to.be.true;

    await del(outputDirectory);
  });

  it('should inform the user that the app doesn\'t have javascript files to register'); // eslint-disable-line max-len

  it('should not build anything from assets folder, and instead just copy the file'); // eslint-disable-line max-len
});
