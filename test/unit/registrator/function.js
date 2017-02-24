import registratorFunction from '../../../src/registrator/function';

describe('registratorFunction', () => {
  describe('.test', () => {
    it('should perform the test validation for the input and return true', () => { // eslint-disable-line max-len
      const testFn = {};
      testFn.default = () => {};
      testFn.route = {};
      expect(registratorFunction.test(null, testFn, null)).to.be.true;
    });

    it('should perform the test validation for the input and return false if that\'s a string', () => { // eslint-disable-line max-len
      expect(registratorFunction.test(null, 'wrongValue', null)).to.be.false;
    });
  });
});
