import wedeployMiddleware from 'wedeploy-middleware';

export default (app) => {
  let authMiddleware = wedeployMiddleware.auth({
    // Using the container id "auth" to setup WeDeploy auth middleware url.
    // For production it is also possible to point to the full url of
    // the auth service, e.g. auth.magnet-example.wedeploy.io.
    url: 'auth',
    // scopes: ['superuser', 'manager']
  });
  app.use('/private/*', authMiddleware);
};
