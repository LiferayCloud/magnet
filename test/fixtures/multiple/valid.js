export default (app, magnet) => {
  app.get('/route-one', (req, res) => res.end('one'));
  app.get('/route-two', (req, res) => res.end('two'));
};
