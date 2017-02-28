export default (app, magnet) => {
  app.get('/foo', (req, res) => res.end('foo'));
};
