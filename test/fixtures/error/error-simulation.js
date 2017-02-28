export const route = {
  path: '/error',
  method: 'get',
  type: 'json',
};

export default async (req) => {
 throw new Error('error message');
};
