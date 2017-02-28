/**
 * Validator error middleware.
 * @return {Function}
 */
export function validatorErrorMiddleware() {
  return (err, req, res, next) => {
    if (err.isEmpty && !err.isEmpty()) {
      let error = new Error('Bad Request');
      error.status = 400;
      error.errors = err.array();
      next(error);
    }
  };
}
