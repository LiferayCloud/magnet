import Server from '../../src/server';
import ServerFactory from '../../src/server-factory';

describe('ServerFactory', function() {
  it('should create an instance of a server', () => {
    let server = ServerFactory.create(ServerFactory.EXPRESS, 3000, "0.0.0.0");
    expect(server instanceof Server).to.equal(true);
  });

  it('should thrown an error if the specified type is not implemented', () => {
    expect(function() {
      ServerFactory.create('notImplemented');
    }).to.throw('Engine not implemented');
  });

  it('should thrown an error if the specified port is not implemented', () => {
    expect(function() {
      ServerFactory.create(ServerFactory.EXPRESS, null, "0.0.0.0");
    }).to.throw('port server is required');
  });

  it('should thrown an error if the specified host is not implemented', () => {
    expect(function() {
      ServerFactory.create(ServerFactory.EXPRESS, 3000, null);
    }).to.throw('host server is required');
  });

});
