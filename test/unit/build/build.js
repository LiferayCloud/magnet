import {build} from '../../../src/build/build';
import Magnet from '../../../src/magnet';
import path from 'path';
import del from 'del';
import {existsSync} from 'fs';
// import webpack from 'webpack';

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

  // it.only('should raise an error on webpack', () => {
  //   const magnet = new Magnet({directory});
  //   const outputDirectory = path.join(directory, '.magnet');
  //   mock(webpack).throws();
  //   build(magnet.getFiles(directory), directory, outputDirectory)
  //     .catch((e) => {

  //     });
  // });
});
