export const route = {
  method: 'get',
  path: '/private/api',
  type: 'json',
};

export default async (req) => {
  return {hello: 'this is a private api'};
};
