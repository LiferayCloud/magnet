export const route = {
  multiple: true,
};

/**
 * @param {Magnet} app
 */
export default function(app) {
  app.get('/two', (req, res) => res.send('two'));
}
