import {
  assertDefAndNotNull,
  assertFunction,
  assertNotNull,
  assertObject,
  assertString,
} from '../../src/assertions';

describe('assertions', function() {
  describe('assertDefAndNotNull', function() {
    it('should thrown an error when it\'s not defined', () => {
      expect(function() {
         assertDefAndNotNull(undefined, 'error message');
      }).to.throw('error message');
    });

    it('should thrown an error when it\'s null', () => {
      expect(function() {
         assertDefAndNotNull(null, 'error message');
      }).to.throw('error message');
    });
  });

  describe('assertNotNull', function() {
    it('should thrown an error when it\'s null', () => {
      expect(function() {
         assertNotNull(null, 'error message');
      }).to.throw('error message');
    });
  });

  describe('assertFunction', function() {
    it('should thrown an error when it\'s not a function', () => {
      expect(function() {
         assertFunction('string', 'error message');
      }).to.throw('error message');
    });
  });

  describe('assertObject', function() {
    it('should thrown an error when it\'s not an object', () => {
      expect(function() {
         assertObject('string', 'error message');
      }).to.throw('error message');
    });
  });

  describe('assertString', function() {
    it('should thrown an error when it\'s not an object', () => {
      expect(function() {
         assertString(1, 'error message');
      }).to.throw('error message');
    });
  });
});
