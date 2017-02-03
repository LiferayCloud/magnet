import BaseEngine from '../../../src/server/base-engine';

describe('BaseEngine', function() {
  it('should thrown an error if creates an instance of BaseEngine', () => {
    expect(function() {
        new BaseEngine();
    }).to.throw('Cannot construct BaseEngine instances directly.');
  });
});
