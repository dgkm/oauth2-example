var config = require('./../config');
var mongoose = require('mongoose');

mongoose.set("debug", (collectionName, method, query, doc) => {
    console.log(`\nQuery: ${collectionName}.${method} \n`, JSON.stringify(query), doc);
});

console.log("Connecting to ", config.db);
mongoose.connect(config.db, { useMongoClient: true });

module.exports.mongoose = mongoose;
module.exports.oauth = require('./oauth');
module.exports.User = require('./user');
module.exports.OAuthClientsModel = require('./oauth_client');
