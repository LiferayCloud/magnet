import db from './repository'

export const route = {
  method: 'delete',
  path: '/category',
  type: 'json',
};

export default async (req) => {
  const category = await db.categories().del(req.body.category.id)
  return category;
};

