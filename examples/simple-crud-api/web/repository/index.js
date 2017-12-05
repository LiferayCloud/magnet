const mysql = require('mysql')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'netinho123',
	database: 'node_api'
})

const errorHandler = (error, msg, rejectedFunction) => {
	console.log(error)
	rejectedFunction({ error: msg })
}

const categoryModule = require('./categories')({ connection, errorHandler })

module.exports = {
  categories: () => categoryModule
}


