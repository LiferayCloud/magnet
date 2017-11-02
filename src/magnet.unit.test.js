import Magnet from './magnet';

describe('Magnet', () => {
  describe('config', () => {
    test('raises an error if no options are provided', () => {
      expect(() => {
        new Magnet();
      }).toThrow(
        `Magnet options are required, try: ` +
          `new Magnet({directory: \'/app\'}).`
      );
    });
    test('raises an error if no directory is provided', () => {
      expect(() => {
        new Magnet({});
      }).toThrow(
        `Magnet directory is required, try: ` +
          `new Magnet({directory: \'/app\'}).`
      );
    });
  });
});
