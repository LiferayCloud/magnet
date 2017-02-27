export const route = {
  path: '/fn-true',
  method: 'get',
  type: 'json',
};

export default (req, res) => res.json({foo: 'bar'});
