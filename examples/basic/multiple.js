export default (app, magnet) => {
  app.get('/foo1', (req, res) => res.end('foo1'));
  app.get('/foo2', (req, res) => res.end('foo2'));
};
