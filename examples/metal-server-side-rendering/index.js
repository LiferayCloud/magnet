import {JSXComponent} from 'metal-jsx';

export const route = {
  path: '/',
  method: 'get',
  type: 'html',
};

export default class Index extends JSXComponent {
  static async renderLayout(req, content, initialState) {
    return <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Index</title>
      </head>
      <body>
        {content}
        <div>Footer</div>
      </body>
      </html>;
  }

  render() {
    return <div>
      <h1>Metal.js server side rendering</h1>
      <a href="/page1">Soy example</a><br/>
      <a href="/page2">JSX example</a>
    </div>
  }
};
