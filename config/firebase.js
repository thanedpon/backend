const firebase = require('firebase').initializeApp({
    serviceAccount: "./ServiceAccountKey.json",
    databaseURL: "https://pdb-app-c9d98.firebaseio.com/"
}); 

module.exports = firebase;