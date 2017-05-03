/**
 * @param {Magnet} app
 */
export const controller = function(app) {
  app.get('/one', (req, res) => res.send('one'));
};

