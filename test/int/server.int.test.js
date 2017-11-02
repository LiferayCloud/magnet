import http from 'http';
import Server from '../../src/server';

const fakeEngine = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Fake Engine');
};
const server = new Server(fakeEngine).setPort(8888).setHost('localhost');

describe('Server', function() {
  beforeAll(function() {
    server.listen(() => {});
  });

  afterAll(function() {
    server.close();
  });

  test('validates the usage of an engine', done => {
    http.get('http://localhost:8888', function(res) {
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => {
        expect(200).toBe(res.statusCode);
        expect(rawData).toBe('Fake Engine');
        done();
      });
    });
  });

  test('returns the current engine used in the server', function() {
    expect(server.getEngine()).toEqual(fakeEngine);
  });
});
