export const route = {
  method: 'get',
  path: '/api',
  type: 'json',
};

export default async (req) => {
  return {hello: 'this is a public api'};
};
