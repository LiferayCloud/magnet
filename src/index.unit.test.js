import {Magnet, Server, ServerFactory} from './index';

describe('index', function() {
  test('imports Magnet class successfully', () => {
    expect(typeof Magnet).toBe('function');
  });

  test('imports Server class successfully', () => {
    expect(typeof Server).toBe('function');
  });

  test('imports ServerFactory class successfully', () => {
    expect(typeof ServerFactory).toBe('function');
  });
});
