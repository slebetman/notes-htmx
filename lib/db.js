const knex = require('knex');
const conf = require('./config');

const db = knex({
	client: 'sqlite3',
	connection: {
		filename: conf.db.file
	},
	useNullAsDefault: true,
});

module.exports = db;