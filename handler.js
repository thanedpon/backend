'use strict';

const db = require('./db_connect');

module.exports.hello = (event, context, callback) => {

  const reply =  event.pathParameters.name;

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: JSON.stringify(reply)
    })
  };

  callback(null, response);
};


module.exports.getDataAll = async (event, context, callback) => {
  try {
    let data = await db.getAll('company')
    return{
      statusCode: 200,
      body: JSON.stringify({
        userdata: data
      })
  }
  } catch(e) {
    console.log(e)
  }
};

module.exports.getDataId = async (event) => {
  try {
    let data = await db.getById('company', event.pathParameters.id)
    return{
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        userdata: data
      })
    }
  } catch(e) {
    console.log(e)
  }
};

module.exports.DeleteDataById = async (event) => {
  try {
    let data = await db.deleteById('company', event.pathParameters.id)
    return{
      statusCode: 200,
      body: JSON.stringify({
        message: 'Delete Success'
      })
    }
  } catch(e) {
    console.log(e)
  }
};




