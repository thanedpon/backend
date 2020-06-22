const PgConnection = require('postgresql-easy');
const dbconnect = require('./config/db');

const pg = new PgConnection(dbconnect)


module.exports = pg;