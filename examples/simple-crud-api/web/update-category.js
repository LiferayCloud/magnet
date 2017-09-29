import category from './repository/categories'

export const route = {
  method: 'put',
  path: '/category',
  type: 'json',
};

export default async (req) => {
  const categoryRequest = req.body.category
  const categoryResponse = await category.update(categoryRequest.id, categoryRequest.name)
  return categoryResponse;
};

