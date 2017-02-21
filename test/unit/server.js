import http from 'http';
import Server from '../../src/server';

const fakeEngine = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Fake Engine');
};
const server = new Server(fakeEngine);

describe('Server', function() {
  before(function() {
    server.listen(8888, 'localhost', () => {});
  });

  after(function() {
    server.close();
  });

  it('should validate the usage of an engine', (done) => {
    http.get('http://localhost:8888', function(res) {
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        expect(200).to.equal(res.statusCode);
        expect(rawData).to.equal('Fake Engine');
        done();
      });
    });
  });

  it('should return the current engine used in the server', function() {
    expect(server.getEngine()).to.equal(fakeEngine);
  });
});
