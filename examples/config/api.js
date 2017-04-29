export const route = {
  multiple: true,
};

export default (app, magnet) => {
  app.get('/', (req, res) => {
    res.json({environment_message: magnet.config.customEnvironmentMessage});
  });
};
