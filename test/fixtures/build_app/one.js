/**
 * @param {Magnet} app
 */
export default function(app) {
  app.get('/one', (req, res) => {
    res.json({foo: 'bar'});
  });
}
