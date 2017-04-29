import {JSXComponent} from 'metal-jsx';

export default class Layout extends JSXComponent {
  static async renderLayout(req, content, initialState) {
    return <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Index</title>
      </head>
      <body>
        {content}
      </body>
      </html>;
  }
};
