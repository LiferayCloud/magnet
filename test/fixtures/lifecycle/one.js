export const route = {
  multiple: true,
};

/**
 * @param {Magnet} app
 */
export default function(app) {
  app.get('/one', (req, res) => res.send('one'));
}
