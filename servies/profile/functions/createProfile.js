const firebase = require('../../../config/firebase');
const moment = require('moment');
const logger = require('tracer').console();

module.exports.createProfile = async (payload) => {
    const method = "async";
    const action = "createProfile";
    logger.trace(`[${method}] BEGIN`);
    try{
        const createdAt = moment(payload.createdAt).format('YYYY-MM-DD');
        firebase.database().ref(`functions/${action}/${createdAt}/${payload.firstname}`).push({
            username : payload.firstname,
            createdAt: payload.createdAt,
            action: action
        }).then(() => {
            logger.trace(`[${method}] END`);
        })
    } catch (err) {
        console.log(err);
    }
}