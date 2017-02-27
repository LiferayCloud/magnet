export const route = {
  path: '/fn-header-not-sent',
  method: 'get',
  type: 'json',
};

export default (req, res) => {
  return 'rendered by helper';
};
