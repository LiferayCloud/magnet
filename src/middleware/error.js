import log from '../log';
import PrettyError from 'pretty-error';

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
    const renderedError = new PrettyError().render(err);
    const serializedError = JSON.stringify(result, 2, 2);
    log.error(false, `${renderedError}${serializedError}`);
    res.status(status).json(result);
  };
}
