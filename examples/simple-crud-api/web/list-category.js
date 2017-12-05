import category from './repository/categories'

export const route = {
  method: 'get',
  path: '/category',
  type: 'json',
};

export default async (req) => {
  const categories = await category.all()
  return categories;
};

