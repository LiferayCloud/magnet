export const route = {
  multiple: true,
};

/**
 * @param {Magnet} app
 */
export default function(app) {
  app.get('/v1', (req, res) => {
    res.json({foo: 'bar'});
  });

  app.get('/', (req, res) => {
    res.json({foo: 'bar'});
  });
}
