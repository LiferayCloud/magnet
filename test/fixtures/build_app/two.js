/**
 * @param {Magnet} app
 */
export default function(app) {
  app.get('/two', (req, res) => {
    res.json({foo: 'bar'});
  });
}
