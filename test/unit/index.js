import {Magnet, Server, ServerFactory} from '../../src/index';

describe('main import', function() {
  it('should import Magnet class successfully', () => {
    expect(typeof Magnet).to.equal('function');
  });

  it('should import Server class successfully', () => {
    expect(typeof Server).to.equal('function');
  });

  it('should import ServerFactory class successfully', () => {
    expect(typeof ServerFactory).to.equal('function');
  });
});
