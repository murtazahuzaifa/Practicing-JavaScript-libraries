const AWS = require('aws-sdk');
require('dotenv').config({ path: '../../.env' });
const REGION = process.env.REGION;
const awsConfig = {
    region: REGION,
    // "endpoint": `http://cognito.${REGION}.amazonaws.com`,
    "accessKeyId": process.env.ACCESS_KEY_ID,
    'secretAccessKey': process.env.SECRET_ACCESS_KEY,
};
AWS.config.update({ ...awsConfig });

const cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider();

//////////////////////////////////////////////////////////////////////
// ref  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminCreateUser-property

cognitoServiceProvider.adminCreateUser({
    UserPoolId: process.env.USER_POOL_ID, /* required */
    Username: "9743456673",
    UserAttributes: [
        { Name: "email", Value: "murtaza.huzaifa2@gmail.com" },
    ],
    TemporaryPassword: "Murtaza@123",
    
}, function (err, data) {
    if (err) console.log("ERROR==>", err, "\nERROR.STACK==>", err.stack); // an error occurred
    else console.log(JSON.stringify(data, null, 2));// successful response
});

