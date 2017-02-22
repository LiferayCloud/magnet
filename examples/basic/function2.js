export const route = {
  path: '/fn2',
  method: 'get',
  type: 'html',
};

export default async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 'fn2';
};
