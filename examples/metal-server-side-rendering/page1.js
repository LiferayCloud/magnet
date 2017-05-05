import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './page1.soy.js';

export const route = {
  path: '/page1',
  method: 'get',
};

export default class Page1 extends Component {
  static async getInitialState(req) {
    return req.query;
  }
};

Soy.register(Page1, templates);

Page1.STATE = {
  attr: {
    value: 'Soy',
  },
}