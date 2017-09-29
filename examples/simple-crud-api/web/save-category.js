import category from './repository/categories'

export const route = {
  method: 'post',
  path: '/category',
  type: 'json',
};

export default async (req) => {
  const categoryRequest = req.body.category;
  const categoryResponse = await category.save(categoryRequest.name)
  return categoryResponse;
};

