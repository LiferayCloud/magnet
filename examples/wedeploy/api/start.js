import wedeployMiddleware from 'wedeploy-middleware';

export default (app) => {
  let authMiddleware = wedeployMiddleware.auth({
    url: 'auth',

    // It is also possible to point to the full url of the auth service.
    // url: 'auth.myproject.wedeploy.io',

    // Authenticating with scopes
    // scopes: ['superuser', 'manager']
  });

  // Matching paths will be protected by the middleware
  app.use('/private/*', authMiddleware);
};
