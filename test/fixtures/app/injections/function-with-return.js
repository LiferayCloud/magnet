export const route = {
  path: '/fn-return',
  method: 'get',
  type: 'json',
};

export default (req, res) => {
  return {foo: 'bar'};
};
