export const route = {
  path: '/fn',
  method: 'get',
  type: 'json',
};

export default (req, res) => res.json({foo: 'bar'});
