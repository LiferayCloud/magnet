import test from 'ava'
const { connection, errorHandler } = require('./setup')

const categories = require('../web/repository/categories')({ connection, errorHandler })

const create = () => categories.save('category test')

test.beforeEach(t => connection.query('TRUNCATE TABLE categories'))
test.after.always(t => connection.query('TRUNCATE TABLE categories'))

test('List categories', async t => {
  await create()
  const list = await categories.all()
  t.is(list.categories.length, 1)
  t.is(list.categories[0].name, 'category test')
})

test('Insert Category', async t => {
  const result = await create()
  t.is(result.category.name, 'category test')
})

test('Update category', async t => {
  const insert = await create()
  const updated = await categories.update(insert.category.id, 'updated-name')
  t.is(updated.category.name, 'updated-name')
})

test('Remove category', async t => {
  const insert = await create()
  const remove = await categories.del(insert.category.id)
  t.is(remove.affectedRows, 1)
})
