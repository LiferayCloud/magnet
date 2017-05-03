/**
 * @param {Magnet} app
 */
export const controller = function(app) {
  app.get('/two', (req, res) => res.send('two'));
}
