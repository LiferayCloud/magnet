import db from './repository'

export const route = {
  method: 'post',
  path: '/category',
  type: 'json',
};

export default async (req) => {
  const categoryRequest = req.body.category;
  const categoryResponse = await db.categories().save(categoryRequest.name)
  return categoryResponse;
};

