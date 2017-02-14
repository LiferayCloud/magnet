import ServerEngineFactory from '../../../src/server/server-engine-factory';
import ExpressEngine from '../../../src/server/express-engine';

describe('ServerEngineFactory', function() {
  it('should create an instance of a express by default', () => {
    let engine = ServerEngineFactory.create();
    expect(engine instanceof ExpressEngine).to.equal(true);
  });

  it('should create an instance of a express by passing a param', () => {
    const engine = ServerEngineFactory.create(
      ServerEngineFactory.Types.EXPRESS);
    expect(engine instanceof ExpressEngine).to.equal(true);
  });

  it('should thrown an error if the specified type is not implemented', () => {
    expect(function() {
      ServerEngineFactory.create('notImplemented');
    }).to.throw('Engine not implemented');
  });
});
