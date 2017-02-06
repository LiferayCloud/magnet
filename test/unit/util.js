import {isNumber, isPromise, isString, isBoolean} from '../../src/util';

describe('util', function() {
  describe('isNumber', function() {
    it('should return true when numberic value is passed', () => {
      expect(isNumber(1)).to.be.true;
    });

    it('should return false when a non numberic value is passed', () => {
      expect(isNumber('string')).to.be.false;
    });
  });

  describe('isBoolean', function() {
    it('should return true when boolean value is passed', () => {
      expect(isBoolean(true)).to.be.true;
    });

    it('should return false when a non boolean value is passed', () => {
      expect(isBoolean('string')).to.be.false;
    });
  });

  describe('isString', function() {
    it('should return true when a string value is passed', () => {
      expect(isString('string')).to.be.true;
    });

    it('should return false when a non string value is passed', () => {
      expect(isString(1)).to.be.false;
    });
  });

  describe('isPromise', function() {
    it('should return true when a promise is passed', () => {
      const prom = new Promise((resolve) => {
        resolve();
      });
      expect(isPromise(prom)).to.be.true;
    });

    it('should return false when a non numberic value is passed', () => {
      expect(isPromise('string')).to.be.false;
    });
  });
});
