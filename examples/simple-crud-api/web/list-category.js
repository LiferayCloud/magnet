import db from './repository'

export const route = {
  method: 'get',
  path: '/category',
  type: 'json',
};

export default async (req) => {
  const category = await db.categories().all()
  return category;
};

