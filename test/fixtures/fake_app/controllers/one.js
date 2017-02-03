export default (app) => {
  // root v1
  app.get('/v1', (req, res) => {
    res.json({foo: 'bar'});
  });

  // root
  app.get('/', (req, res) => {
    res.json({foo: 'bar'});
  });
};
