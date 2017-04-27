export const route = {
  path: '/error-validation',
  method: 'get',
  type: 'json',
};

export default async req => {
  req.assert('name', 'parameter_required').notEmpty();

  let validation = await req.getValidationResult();
  validation.throw();

  return {hello: req.query.name};
};
