import {ComponentRegistry} from 'metal-component';
import {JSXComponent} from 'metal-jsx';
import layout from './layout';

export const route = {
  path: '/',
  method: 'get',
};

export default class Index extends JSXComponent {
  /**
   * Optional static method to define page layout. Relevant to be able to have
   * full control of page markup.
   * @param {Object} req The request object.
   * @param {string} content The content rendered on "render()".
   * @param {Object} initialState Initial state returned by "getInitialState"
   * static method.
   * @return {String|IncrementalDOM}
   */
  static renderLayout(req, content, initialState) {
    return layout(req, content, initialState);
  }

  /**
   * Optional static method to provide the component's initial render state.
   * This method is intented to be called from the server on page first
   * render, post navigations uses this method to pre-fetch the page state on
   * the client.
   * @param {Object} req The request object.
   * @return {Object} The initial render state.
   */
  static getInitialState(req) {
    return {};
  }

  render() {
    return <div>
      <h1>Metal.js server side rendering</h1>
      <a href="/page1">Soy example</a><br/>
      <a href="/page2">JSX example</a>
    </div>
  }
};

ComponentRegistry.register(Index);
