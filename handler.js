'use strict';

const db = require('./db_connect');
let jwt = require('jsonwebtoken');
let serviceAuth = require('./servies/auth-service/functions/login');
let serviceCreate = require('./servies/profile/functions/createProfile');


module.exports.hello = (event, context, callback) => {

  const reply = event.pathParameters.name;

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: JSON.stringify(reply)
    })
  };
  callback(null, response);
};

module.exports.checkAuth = async (req, res) => {
  let username = JSON.parse(req.body).username;
  let password = JSON.parse(req.body).password;
  let lastLoginAt = JSON.parse(req.body).lastLoginAt;
  try {
    let queryData = await db.query(`select * from identifier where username = '${username}' and password = '${password}'`);
    let updatedTime = await db.query(`update identifier set lastLoginAt = '${lastLoginAt}' where user_id = ${queryData[0].user_id}`)
    let userId = queryData[0].user_id;
    if (queryData[0].username == username && queryData[0].password == password && updatedTime ) {
      const token = jwt.sign({ userId }, 'my_secret_key');
      // Login.authLogin({username, lastLoginAt})
      serviceAuth.authLogin({username, lastLoginAt})
      return {
        statusCode: 200,
        body: JSON.stringify({
          "success": true,
          token: token,
          status: queryData[0].status
        })
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "invalid username / password" })
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports.getPersonalData = async (req, res) => {
  try {
    let encode = jwt.verify(ensureToken(req), 'my_secret_key');
    let queryData = await db.query(`select * from identifier where user_id = '${encode.userId}'`);
    if (queryData) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          userId: queryData[0].user_id,
          username: queryData[0].firstname,
          lastname: queryData[0].lastname,
          mobile_phone: queryData[0].phone,
          lastLoginAt: queryData[0].lastlogin_at
        })
      }
    } else {
      return {
        statusCode: 403
      }
    }
  } catch (e) {
    console.log('err', e)
  }
}

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["Authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    return req.token
  } else {
    return {
      statusCode: 403
    }
  }
};


module.exports.createProfile = async (req, res, next) => {
  let val = {
    user_id: JSON.parse(req.body).user_id,
    firstname: JSON.parse(req.body).username,
    lastname: JSON.parse(req.body).lastname,
    email: JSON.parse(req.body).email,
    mobile_phone: JSON.parse(req.body).mobile_phone,
    status: JSON.parse(req.body).status,
    createdAt: JSON.parse(req.body).createdAt
  }

  try {
    let encode = jwt.verify(ensureToken(req), 'my_secret_key');
    if (encode.userId) {
      let statement = `insert into customer (user_id, firstname, lastname, email, mobile_phone, status) values ('${val.user_id}', '${val.firstname}', '${val.lastname}', '${val.email}', '${val.mobile_phone}', '${val.status}')`
      let insertData = await db.query(statement);
      serviceCreate.createProfile(val);
      if (insertData){
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Success'
          })
        }
      } else {
        return {
          statusCode: 403
        }
      }
    }
    else {
      return {
        statusCode: 403
      }
    }
  } catch (e) {
    console.log(e)
  }
};

module.exports.updatedData = async (req, res, next) => {
  let val = {
    id: JSON.parse(req.body).id,
    firstname: JSON.parse(req.body).firstname,
    lastname: JSON.parse(req.body).lastname,
    email: JSON.parse(req.body).email,
    mobile_phone: JSON.parse(req.body).mobile_phone,
  }
  console.log(val.id)
  console.log(val.firstname)
  console.log(val.lastname)
  console.log(val.email)
  console.log(val.mobile_phone)

  try{
    let encode = jwt.verify(ensureToken(req), 'my_secret_key');
    if (encode.userId) {
      let statement = 
        `update customer set 
          firstname = '${val.firstname}', lastname = '${val.lastname}', email = '${val.email}', mobile_phone = '${val.mobile_phone}'
          where id = ${val.id}`
      let updateData = await db.query(statement);
      if (updateData){
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Update Success'
          })
        }
      }
    } else {
      return {
        statusCode: 403
      }
    }
  } catch (err) {
    console.log(err);
  }
}



module.exports.getDataById = async (req, res, next) => {
  try{
    let encode = jwt.verify(ensureToken(req), 'my_secret_key');
    console.log('encode', encode.userId)
    if(encode.userId){
      let queryData = await db.query(`select * from customer where user_id = '${encode.userId}'`);
      // console.log(queryData)
      if (queryData){
        return{
          statusCode: 200,
          body: JSON.stringify({
            data : queryData
          })
        }
      }
    }
  } catch(err){
    console.log(err)
  }
};



module.exports.getVehicleById = async (req, res, next) => {
  try {
    let encode = jwt.verify(ensureToken(req), 'my_secret_key');
    let queryData = await db.query(`select * from vehicle where user_id = '${req.pathParameters.id}'`);
    if (encode.userId == queryData[0].user_id) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          vehicleId: queryData[0].vehicle_id,
          vehicleName: queryData[0].vehicle_name,
          vehicleType: queryData[0].vehicle_type,
          vehicleYear: queryData[0].vehicle_year
        })
      }
    }
  } catch (e) {
    return {
      statusCode: 403
    }
  }
};


module.exports.getDataAll = async (event, context, callback) => {
  try {
    let data = await db.getAll('company')
    return {
      statusCode: 200,
      body: JSON.stringify({
        userdata: data
      })
    }
  } catch (e) {
    console.log(e)
  }
};

module.exports.getDataId = async (event) => {
  try {
    let data = await db.getById('company', event.pathParameters.id)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        userdata: data
      })
    }
  } catch (e) {
    console.log(e)
  }
};

module.exports.DeleteDataById = async (event) => {
  try {
    let data = await db.deleteById('company', event.pathParameters.id)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Delete Success'
      })
    }
  } catch (e) {
    console.log(e)
  }
};



