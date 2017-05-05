import {JSXComponent} from 'metal-jsx';
import {ComponentRegistry} from 'metal-component';

export const route = {
  path: '/page2',
  method: 'get',
};

export default class Page2 extends JSXComponent {
  static async getInitialState(req) {
    return req.query;
  }

  render() {
    return <div>
      <h1>Hello {this.props.attr}!</h1>
      <a href="/page1">Navigate</a>
    </div>
  }
};

Page2.PROPS = {
  attr: {
    value: 'JSX',
  },
}

ComponentRegistry.register(Page2);