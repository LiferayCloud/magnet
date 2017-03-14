import Server from '../../src/server';
import ServerFactory from '../../src/server-factory';

describe('ServerFactory', function() {
  it('should create an instance of a server', () => {
    let server = ServerFactory.create();
    expect(server instanceof Server).to.equal(true);
  });

  it('should create an instance of a server with express by default', () => {
    let server = ServerFactory.create();
    expect(isExpress(server.getEngine())).to.equal(true);
  });

  it('should create an instance of a express by passing a param', () => {
    const server = ServerFactory.create(
      ServerFactory.Types.EXPRESS);
      expect(isExpress(server.getEngine())).to.equal(true);
  });

  it('should thrown an error if the specified type is not implemented', () => {
    expect(function() {
      ServerFactory.create('notImplemented');
    }).to.throw('Engine not implemented');
  });

  
});