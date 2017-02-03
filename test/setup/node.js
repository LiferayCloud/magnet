import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

global.chai = chai;
global.sinon = sinon;
global.chai.use(sinonChai);

require('babel-core/register');
require('./setup')();
