import ExpressEngine from '../../../src/server/express-engine';

describe('ExpressEngine', function() {
  it('should create an instance of a express engine', () => {
    const engine = new ExpressEngine();
    expect(engine.getEngine()).to.not.equal(null);
    expect(typeof engine.getEngine()).to.equal('function');
  });
});
