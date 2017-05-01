import Magnet from '../../../src/magnet';
// import pluginMultiple from '../../../src/plugin/multiple';

describe('pluginMultiple', () => {
  // describe('.test', () => {
  //   it('should return true if module has route multiple', () => {
  //     const mod = {};
  //     mod.route = {multiple: true};
  //     mod.default = (app, magnet) => {};
  //     expect(pluginMultiple.test(mod, null, null)).to.be.true;
  //   });

  //   it('should return false if module is not function', () => {
  //     const mod = {};
  //     mod.route = {multiple: true};
  //     mod.default = 'not a function';
  //     expect(pluginMultiple.test(mod, null, null)).to.be.false;
  //   });
  // });

  describe('integration', () => {
    let magnet;
    const directory = `${process.cwd()}/test/fixtures/multiple`;

    beforeEach(async () => {
      magnet = new Magnet({directory});
      await magnet.build();
      await magnet.start();
    });

    afterEach(async () => {
      await magnet.stop();
    });

    it('should register multiple module from directory', async () => {
      await assertAsyncHttpRequest({
        path: '/route-one',
        responseBody: 'one',
      });
      await assertAsyncHttpRequest({
        path: '/route-two',
        responseBody: 'two',
      });
    });
  });
});
