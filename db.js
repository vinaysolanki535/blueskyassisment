const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  password: '8224032321',
  database: 'postgres',
  host: 'database-1.cknteqhshprh.ap-south-1.rds.amazonaws.com',
  port: '5432',
})

module.exports = pool
