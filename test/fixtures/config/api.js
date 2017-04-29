export const route = {
  multiple: true,
};

export default (app, magnet) => {
  app.get('/', (req, res) => {
    res.json({environment: magnet.getConfig().environment});
  });
};
