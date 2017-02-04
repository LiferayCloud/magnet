/**
 * Error middleware
 * @param  {Object} engine
 * @return {Function}
 */
export function errorMiddleware(engine) {
  return engine.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (engine.get('env') === 'development' ? err : {}),
    });
    next(err);
  });
}
