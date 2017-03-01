import {existsSync} from 'fs';
import fs from 'fs-extra';
import Magnet from '../../src/magnet';
import path from 'path';
import Server from '../../src/server';

describe('Magnet', () => {
  describe('config', () => {
    it('should raise an error if no options are provided', () => {
      expect(() => {
         new Magnet();
      }).to.throw(`Magnet options are required, try: new Magnet({directory: \'/app\'}).`); // eslint-disable-line max-len
    });
    it('should raise an error if no directory is provided', () => {
      expect(() => {
         new Magnet({});
      }).to.throw(`Magnet directory is required, try: new Magnet({directory: \'/app\'}).`); // eslint-disable-line max-len
    });
  });

  describe('#build', () => {
    it('should build app directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(existsSync(path.join(magnet.getServerDistDirectory(), 'one.js')))
        .to.be.true;
      expect(existsSync(path.join(magnet.getServerDistDirectory(), 'two.js')))
        .to.be.true;
      fs.removeSync(magnet.getServerDistDirectory());
    });

    it('should not build empty directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/empty`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(existsSync(magnet.getServerDistDirectory()))
        .to.be.false;
    });
  });

  describe('#getDirectory', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should return the instance directory', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getDirectory())
        .to.equal(`${process.cwd()}/test/fixtures/app`);
    });
  });

  describe('#getServer', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should return current server', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getServer() instanceof Server).to.be.true;
    });

    it('should return current server engine', () => {
      const magnet = new Magnet({directory});
      expect(isExpress(magnet.getServer().getEngine()))
        .to.equal(true);
    });
  });

  describe('#getServerDistDirectory', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should return server distribution directory path', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getServerDistDirectory())
        .to.equal(`${process.cwd()}/test/fixtures/app/.magnet/server`);
    });
  });

  describe('#getFiles', () => {
    it('should not match files inside a static folder', () => {
      const directory = `${process.cwd()}/test/fixtures/static`;
      const magnet = new Magnet({directory});
      const files = magnet.getFiles(directory);
      expect(files).to.deep.equal([]);
    });

    it('should return an empty array if directory is empty', () => {
      const directory = `${process.cwd()}/test/fixtures/empty`;
      const magnet = new Magnet({directory});
      const files = magnet.getFiles(directory);
      expect(files).to.deep.equal([]);
    });

    it('should get files with its realpath', () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      const files = magnet.getFiles(directory, true);
      const expectedArray = [
        path.join(directory, 'one.js'),
        path.join(directory, 'two.js'),
      ];
      expect(files).to.deep.equal(expectedArray);
    });
  });

  describe('#hasServerDistDirectory', () => {
    it('should return true if server dist directory exists', async () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      await magnet.build();
      expect(magnet.hasServerDistDirectory()).to.be.true;
      fs.removeSync(magnet.getServerDistDirectory());
    });

    it('should return false if server dist directory does not exist', () => {
      const directory = `${process.cwd()}/test/fixtures/build`;
      const magnet = new Magnet({directory});
      expect(magnet.hasServerDistDirectory()).to.be.false;
    });
  });

  describe('#start', () => {
    it('should start a http server', async () => {
      const directory = `${process.cwd()}/test/fixtures/app`;
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await assertAsyncHttpRequest({
        path: '/fn',
        responseBody: JSON.stringify({foo: 'bar'}),
      });
      await magnet.stop();
    });

    it('should serve an application that just has a static folder', async() => { // eslint-disable-line max-len
      const directory = `${process.cwd()}/test/fixtures/assets`;
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await assertAsyncHttpRequest({
        path: '/static/example1.txt',
        responseBody: 'example1\n',
      });
      await magnet.stop();
    });
  });

  describe('#stop', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should stop the application server', async() => {
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
      await magnet.stop();
      expect(magnet.getServer().getHttpServer().address()).to.be.null;
    });
  });
});
