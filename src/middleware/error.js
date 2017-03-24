import log from '../log';

/**
 * Error middleware.
 * @return {Function}
 */
export function errorMiddleware() {
  return (err, req, res, next) => {
    const status = err.status || err.code || 500;
    const message = err.message || '';
    let result = {
      status,
      message,
    };
    if (err.errors) {
      result.errors = err.errors;
    }
    log.error(false, err);
    res.status(status).json(result);
  };
}
