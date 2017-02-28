/**
 * Error middleware.
 * @return {Function}
 */
export function errorMiddleware() {
  return (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || '';
    let result = {
      status,
      message,
    };
    if (err.errors) {
      result.errors = err.errors;
    }
    res.status(status).json(result);
  };
}
