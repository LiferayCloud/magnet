export const route = {
  method: 'get',
  path: '/api',
  type: 'json',
};

export default async (req) => {
  req.assert('name', 'parameter_required').notEmpty();
  req.assert('name', 'parameter_must_be_alphanumeric').isAlpha();

  let validation = await req.getValidationResult();
  validation.throw();

  return {hello: req.query.name};
};
