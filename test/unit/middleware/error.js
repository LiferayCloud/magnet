import {errorMiddleware} from '../../../src/middleware/error';
import httpMocks from 'node-mocks-http';

describe('errorMiddleware', function() {
  it('should create an instance of a server', () => {
    const request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        query: {
            myid: '312',
        },
    });
    const response = httpMocks.createResponse();
    errorMiddleware()({foo: 'bar'}, request, response, (err) => {
      expect(err).to.deep.equal({foo: 'bar'});
    });
  });
});
