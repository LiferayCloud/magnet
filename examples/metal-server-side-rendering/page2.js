import {JSXComponent} from 'metal-jsx';

export const route = {
  path: '/page2',
  method: 'get',
  type: 'html',
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