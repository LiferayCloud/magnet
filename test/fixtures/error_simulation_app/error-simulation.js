export const route = {
  path: '/fn-error-environment',
  method: 'get',
  type: 'json',
};

export default async (req) => {
 throw new Error('error message');
};
