/**
 * Error middleware.
 * @return {Function}
 */
export function errorMiddleware() {
  return (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || '';
    res.status(status);
    res.json({
      status,
      message,
    });
  };
}
