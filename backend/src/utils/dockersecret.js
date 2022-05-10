const fs = require('fs');
const dockerSecret = {};

// read docker secrets from file
dockerSecret.read = function read(secretName) {
  console.log("Info: Reading docker secret: " + secretName);
  
  try {
    return fs.readFileSync(`/run/secrets/${ secretName }`, 'utf8');
  } catch(err) {
    if (err.code !== 'ENOENT') {
      console.error(`An error occurred while trying to read the secret: ${ secretName }. Err: ${ err }`);
    } else {
      console.log(`Could not find the secret, probably not running in swarm mode or secret not existing: ${ secretName }. Err: ${ err }`);
    }    
    return false;
  }
};

module.exports = dockerSecret;