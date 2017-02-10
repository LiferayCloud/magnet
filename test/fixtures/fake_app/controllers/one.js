module.exports = function(app) {
  app.get('/v1', (req, res) => {
    res.json({foo: 'bar'});
  });

  // root
  app.get('/', (req, res) => {
    res.json({foo: 'bar'});
  });

  return this;
};
