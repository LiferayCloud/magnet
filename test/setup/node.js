import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'regenerator-runtime/runtime';

global.chai = chai;
global.sinon = sinon;
global.chai.use(sinonChai);

require('babel-core/register');
require('./setup')();
