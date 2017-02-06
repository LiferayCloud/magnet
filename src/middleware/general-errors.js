/**
 * Error middleware.
 * @param  {String} environment
 * @return {Function}
 */
export function errorMiddleware(environment) {
  return (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (environment === 'development' ? err : {}),
    });
    next(err);
  };
}
