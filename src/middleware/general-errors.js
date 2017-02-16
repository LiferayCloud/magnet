/**
 * Error middleware.
 * @return {Function}
 */
export default () => {
  return (err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || '';
    res.status(status);
    res.json({
      status,
      message,
    });
    next(err);
  };
};
