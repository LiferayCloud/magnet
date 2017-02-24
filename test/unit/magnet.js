import Magnet from '../../src/magnet';
import Server from '../../src/server';
import {existsSync} from 'fs';
import path from 'path';
import del from 'del';

describe('Magnet', () => {
  describe('config', () => {
    it('should raise an error if no options are provided', () => {
      expect(() => {
         new Magnet();
      }).to.throw(`Magnet options are required, `+
      `try: new Magnet({directory: \'/app\'}).`);
    });
    it('should raise an error if no directory is provided', () => {
      expect(() => {
         new Magnet({});
      }).to.throw(`Magnet directory is required, `+
      `try: new Magnet({directory: \'/app\'}).`);
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

    it('should return the current server', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getServer() instanceof Server).to.be.true;
    });

    it('should return the current server engine', () => {
      const magnet = new Magnet({directory});
      expect(isExpress(magnet.getServer().getEngine()))
        .to.equal(true);
    });
  });

  describe('#getServerDistDirectory', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should return the server distribution directory path', () => {
      const magnet = new Magnet({directory});
      expect(magnet.getServerDistDirectory())
        .to.equal(`${process.cwd()}/test/fixtures/app/.magnet/server`);
    });
  });

  describe('#build', () => {
    it('should build an app directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/build_app`;
      const magnet = new Magnet({directory});
      await magnet.build();

      expect(existsSync(path.join(magnet.getServerDistDirectory(), 'one.js')))
        .to.be.true;
      expect(existsSync(path.join(magnet.getServerDistDirectory(), 'two.js')))
        .to.be.true;

      await del(magnet.getServerDistDirectory());
    });

    it('should not build an empty directory', async () => {
      const directory = `${process.cwd()}/test/fixtures/empty_app`;
      const magnet = new Magnet({directory});
      await magnet.build();

      expect(existsSync(magnet.getServerDistDirectory()))
        .to.be.false;
    });

    it('should build an directory with just static folder');
  });

  describe('#start', () => {
    const directory = `${process.cwd()}/test/fixtures/app`;

    it('should start an http server', async () => {
      const magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();

      await assertAsyncHttpRequest({
        port: 3000,
        path: '/fn',
        responseBody: JSON.stringify({foo: 'bar'}),
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
