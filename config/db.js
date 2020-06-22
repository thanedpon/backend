module.exports = {
    database: 'testdb',
    host: 'localhost',
    port: '5432',
    user: 'thanedka',
    password: '12345678'
}

// const {Client} = require('pg')
// const client = new Client({
//     database: 'testdb',
//     host: 'localhost',
//     port: '5432',
//     user: 'thanedka',
//     password: '12345678'
// })

//client.connect().then(() => console.log('connect')).catch(e => console.log(e).finally(() => client.end()));
// client.connect().then(() => console.log('connect')).then(() => client.query("select * from company")).then(result => console.log(result.rows)).catch(e => console.log(e).finally(() => client.end()));