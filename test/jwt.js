var jwt = require('jsonwebtoken');
const fs = require('fs');

var privateKey = fs.readFileSync('private.key'); // get private key
var publicKey = fs.readFileSync('public.pem'); // get public key

var input = { role: 'mediuser_basic',
    exp: 1577347751, //Math.floor(Date.now() / 1000) + (60 * 1),
    user_id: 2,
    is_admin: false,
    username: 'usercc',
    email: 'usercc',
    aud: 'urn:foo',
    iss: 'urn:issuer' }

var token = jwt.sign(input, { key: privateKey },  { algorithm: 'RS256'});
console.log(token)

var output = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
console.log(output)

jwt.verify(token, publicKey, { audience: 'urn:foo', issuer: 'urn:issuer' }, function(err, decoded) {
   if(err)
     console.error(err);
   else
    console.log(decoded);
});

