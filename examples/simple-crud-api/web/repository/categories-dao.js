import { connection, errorHandler } from './connection'
import { Observable } from 'rxjs/Observable';

const categoryDao = {
    findAll() {
      return Observable.create(function (observer) {
        categoriesQuery.findAll(observer)
      });
    }, 
    save(name) {
      return Observable.create(function (observer) {
        categoriesQuery.save(name, observer)
      });
    },
    update(id, name) {
      return Observable.create(function (observer) {
        categoriesQuery.update(id, name, observer)
      });
    },
    del(id) {
      return Observable.create(function (observer) {
        categoriesQuery.del(id, observer)
      });
    }
} 

const categoriesQuery = {
  failed: (error, observer) => {
    if (error) {
        observer.next(error);
        observer.complete();
        return false
      }
  },
  success: (result, observer) => {
    observer.next(result)
    observer.complete()
  },

  findAll: (observer) => {
    connection.query('SELECT * FROM categories', (error, results) => {
      if (error) categoriesQuery.failed(error, observer)
      categoriesQuery.success(results, observer)
    })
  },
  save: (name, observer) => {
    connection.query('INSERT INTO categories (name) VALUES (?)', [name], (error, results) => {
      if (error) categoriesQuery.failed(error, observer)
      categoriesQuery.success({ name, id: results.insertId }, observer)
    })
  },
  update: (id, name, observer) => {
    connection.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (error, results) => {
      if (error || !results.affectedRows) categoriesQuery.failed(error, observer)
      categoriesQuery.success({ name, id, affectedRows: results.affectedRows}, observer)
    })
  },
  del: (id, observer) => {
    connection.query('DELETE FROM categories WHERE id = ?', [id], (error, results) => {
      if (error || !results.affectedRows) categoriesQuery.failed(error, observer)
      categoriesQuery.success({ message: 'Category removed successfully!', affectedRows: results.affectedRows }, observer)
    })
  }
}

module.exports = categoryDao