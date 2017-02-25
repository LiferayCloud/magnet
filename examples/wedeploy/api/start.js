import wedeployMiddleware from 'wedeploy-middleware';

export default (app) => {
  let authMiddleware = wedeployMiddleware.auth({
    url: 'auth.myproject.wedeploy.io',
    // scopes: ['superuser', 'manager']
  });

  // Matching paths will be protected by the middleware
  app.use('/private/*', authMiddleware);
};
