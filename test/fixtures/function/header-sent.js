export const route = {
  path: '/fn-header-sent',
  method: 'get',
  type: 'json',
};

export default (req, res) => res.send('headers sent');
