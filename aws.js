require('dotenv').config()

var AWS = require('aws-sdk'),
    region = "us-west-1",
    secretName = process.env.AWS_SECRET_NAME,
    secret,
    decodedBinarySecret;

var client = new AWS.SecretsManager({
    region: region
});

const getSecretValue = () => {
    return new Promise((resolve, reject) => {
        client.getSecretValue({SecretId: secretName}, function(err, data) {
            if (err) {
                if (err.code === 'DecryptionFailureException')
                    reject(err);
                else if (err.code === 'InternalServiceErrorException')
                    reject(err);
                else if (err.code === 'InvalidParameterException')
                    reject(err);
                else if (err.code === 'InvalidRequestException')
                    reject(err);
                else if (err.code === 'ResourceNotFoundException')
                    reject(err);
            }
            else {
                if ('SecretString' in data) {
                    secret = data.SecretString;
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    decodedBinarySecret = buff.toString('ascii');
                    resolve(decodedBinarySecret)
                }
            }
        });
    })
}

module.exports = getSecretValue;