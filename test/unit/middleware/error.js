import Magnet from '../../../src/magnet';

describe('errorMiddleware', function() {
  it('should manage to catch an exception if an error occurs in a route function', async () => {
    const directory = `${process.cwd()}/test/fixtures/error`;
    const magnet = new Magnet({directory});
    await magnet.build();
    await magnet.start();
    await assertAsyncHttpRequest({
      path: '/error',
      status: 500,
      responseBody: JSON.stringify({status: 500, message: 'error message'}),
    });
    await magnet.stop();
  });
});
