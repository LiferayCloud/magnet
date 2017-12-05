import categoryDao from './categories-dao'
import { errorHandler } from './connection'

const categoryObj = {
  all() {
    return new Promise((resolve, reject) => {
      const categories = categoryDao.findAll().subscribe({
        next: categories => resolve({ categories: categories}),
        error: err => errorHandler(err, 'Failed to list categories', reject),
        complete: () => console.log('done')
      });
    })
  },
  save(name) {
    return new Promise((resolve, reject) => {
      const categories = categoryDao.save(name).subscribe({
        next: category => resolve({ category: category}),
        error: err => errorHandler(err, `Failed to save category ${name}`, reject),
        complete: () => console.log('done')
      });
    })
  },
  update(id, name) {
    return new Promise((resolve, reject) => {
      const categories = categoryDao.update(id, name).subscribe({
        next: category => resolve({ category: category}),
        error: err => errorHandler(err, `Failed to update category ${name}`, reject),
        complete: () => console.log('done')
      });
    })
  },
  del(id) {
    return new Promise((resolve, reject) => {
      const categories = categoryDao.del(id).subscribe({
        next: message => resolve({ message: message}),
        error: err => errorHandler(err, `Failed to update category ${name}`, reject),
        complete: () => console.log('done')
      });
    })
  }

}

module.exports = categoryObj