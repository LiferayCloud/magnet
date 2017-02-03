import ServerEngineFactory from '../../../src/server/server-engine-factory';
import ExpressEngine from '../../../src/server/express-engine';

describe('ServerEngineFactory', function() {
  it('should create an instance of a express by default', () => {
    const engine = new ServerEngineFactory();
    expect(engine.create() instanceof ExpressEngine).to.equal(true);
  });

  it('should create an instance of a express by passing a param', () => {
    const engine = new ServerEngineFactory('express');
    expect(engine.create() instanceof ExpressEngine).to.equal(true);
  });

  it('should thrown an error if the specified type is not implemented', () => {
    expect(function() {
        const engine = new ServerEngineFactory('notImplemented');
        engine.create();
    }).to.throw('Engine not implemented.');
  });
});
