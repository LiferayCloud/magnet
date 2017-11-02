import Magnet from '../../../src/magnet';

describe('validationErrorMiddleware', function() {
  test('manages to catch an exception if an error occurs in a route function with param validator', async () => {
    const directory = `${process.cwd()}/test/fixtures/error`;
    const magnet = new Magnet({directory});
    await magnet.build();
    await magnet.start();
    const expectedResponseBody = {
      status: 400,
      message: 'Bad Request',
      errors: [
        {
          reason: 'parameter_required',
          context: {param: 'name'},
        },
      ],
    };
    await assertAsyncHttpRequest({
      path: '/error-validation',
      status: 400,
      responseBody: JSON.stringify(expectedResponseBody),
    });
    await magnet.stop();
  });
});
