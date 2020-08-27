const firebase = require('../../../config/firebase');
const moment = require('moment');
const logger = require('tracer').console();

module.exports.authLogin = async (payload) => {
    const method = "async";
    const action = "login";
    logger.trace(`[${method}] BEGIN`);
    try {
        const lastloginat = moment(payload.lastLoginAt).format('YYYY-MM-DD');
        firebase.database().ref(`functions/${action}/${lastloginat}/${payload.username}`).push({
            username : payload.username,
            lastLoginAt: payload.lastLoginAt,
            action: action
        }).then(() => {
            logger.trace(`[${method}] END`);
        })
    } catch (err) {
        console.log(err);
    }
}
