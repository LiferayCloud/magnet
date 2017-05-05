import {ComponentRegistry} from 'metal-component';
import {JSXComponent} from 'metal-jsx';

export const route = {
  path: '/',
  method: 'get',
};

export default class Index extends JSXComponent {
  render() {
    return <div>
      <h1>Metal.js server side rendering</h1>
      <a href="/page1">Soy example</a><br/>
      <a href="/page2">JSX example</a>
    </div>
  }
};

ComponentRegistry.register(Index);