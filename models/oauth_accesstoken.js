var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OAuthAccessTokensSchema = new Schema({
  accessToken: { type: String, required: true, unique: true },
  clientId: String,
  userId: { type: String, required: true },
  expires: Date
});

mongoose.model('oauth_accesstokens', OAuthAccessTokensSchema);

var OAuthAccessTokensModel = mongoose.model('oauth_accesstokens');

module.exports.generateAccessToken = function(type, req, callback) {
  console.log("\n*******\n")
  console.log("Type: ", type);
  console.log("Request: ", req.user);
  console.log("*******\n")
  const token = { role: 'mediuser_basic',
    exp: 1577430178,
    user_id: 2,
    is_admin: false,
    username: 'usercc',
    email: 'usercc',
    aud: 'postgraphile',
    iss: 'postgraphile' }

  callback(null, "aa0c7c8e15e240fc26c98334311315123f2d8b9c" + Date.now())
};

module.exports.getAccessToken = function(bearerToken, callback) {
  OAuthAccessTokensModel.findOne({ accessToken: bearerToken }, callback);
};

module.exports.saveAccessToken = function(token, clientId, expires, userId, callback) {
  var fields = {
    clientId: clientId,
    userId: userId.id ? userId.id : userId,
    expires: expires
  };
  console.log(token, fields);
  OAuthAccessTokensModel.update({ accessToken: token }, fields, { upsert: true }, function(err) {
    if (err) {
      console.error(err);
    }
    
    callback(err);
  });
};
