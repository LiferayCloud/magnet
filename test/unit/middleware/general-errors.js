import generalErrors from '../../../src/middleware/general-errors';
import httpMocks from 'node-mocks-http';

describe('generalErrors', function() {
  it('should create an instance of a server', () => {
    let request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        query: {
            myid: '312'
        }
    });
    let response = httpMocks.createResponse();

    generalErrors()({foo: 'bar'}, request, response, (err) => {
      expect(err).to.deep.equal({foo: 'bar'});
    });
  });
});
