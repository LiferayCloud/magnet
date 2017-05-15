/**
 * @param {Magnet} app
 */
export const controller = function(app) {
  app.get('/v1', (req, res) => {
    res.json({foo: 'bar'});
  });
};
