var jwt = require('jsonwebtoken');
const fs = require('fs');

var privateKey = fs.readFileSync('private.key'); // get private key
var publicKey = fs.readFileSync('public.pem'); // get public key
var key = "ADBACXFSDFSRWERSFQWHGJGJSDFSDGFDGERSFDGSDGFDSDSGASFYRYIO"
var audience = "postgraphile";
var issuer = "postgraphile";

var input = { role: 'mediuser_basic',
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    user_id: 2,
    is_admin: false,
    username: 'admin',
    email: 'admin@treatflo.com',
    aud: audience,
    iss: issuer }

var token = jwt.sign(input, { key: privateKey },  { algorithm: 'RS256'});
console.log(token)

var output = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
console.log(output)

jwt.verify(token, publicKey, { audience: audience, issuer: issuer }, function(err, decoded) {
   if(err)
     console.error(err);
   else
    console.log(decoded);
});

token = jwt.sign(input, key);
console.log(token)

jwt.verify(token, key, { audience: audience, issuer: issuer }, function(err, decoded) {
  if(err)
    console.error(err);
  else
   console.log(decoded);
});

