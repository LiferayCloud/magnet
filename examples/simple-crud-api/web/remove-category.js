import category from './repository/categories'

export const route = {
  method: 'delete',
  path: '/category',
  type: 'json',
};

export default async (req) => {
  const category = await category.del(req.body.category.id)
  return category;
};

