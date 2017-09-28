import db from './repository'

export const route = {
  method: 'put',
  path: '/category',
  type: 'json',
};

export default async (req) => {
  const categoryRequest = req.body.category
  const categoryResponse = await db.categories().update(categoryRequest.id, categoryRequest.name)
  return categoryResponse;
};

