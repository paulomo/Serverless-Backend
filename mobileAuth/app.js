// Require AWS, Express
const AWS = require("aws-sdk");
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");


// configure express
const app = express();
app.use(bodyParser.json({ strict: false }));

AWSCognito.config.region = 'us-east-1'; //This is required to derive the endpoint

// Configure UserPool
const COGNITO_USER_POOL = process.env.COGNITO_USER_POOL;
const CLIENT_APP_ID = process.env.CLIENT_APP_ID;


const COGNITO_USER_POOL_MOBILE = process.env.COGNITO_USER_POOL_WEB;
const CLIENT_APP_ID_MOBILE = process.env.CLIENT_APP_ID_MOBILE;

const poolData = { 
    UserPoolId : COGNITO_USER_POOL,
    ClientId : CLIENT_APP_ID
};
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

/**
 * API Health
 */
app.get("/mobile-auth/auth/health", function(request, response) {
  response.status(200).send({ service: "Mobile Auth", isAlive: true });
});

/**
 * SIGNUP
 */
app.post("/mobile-auth/signup", function(request, response) {
    const { Username, password, firstName } = request.body;
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    const dataPhone = {
        Name : 'phone_number',
        Value : Username
    };
    const firstName = {
        Name : 'given_name',
        Value : firstName
    };
    const attributePhone = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhone);
    const attributefirstName = new AmazonCognitoIdentity.CognitoUserAttribute(firstName);

    attributeList.push(attributePhone);
    attributeList.push(attributefirstName);

    try {
        const result = await userPool.signUp(Username, password, attributeList, null);
        response.status(200).send(result);
    }catch(error){
        response.status(400).send(error);
    }
});

/**
 * SIGNIN
 */
app.post("/mobileu-auth/signin", function(request, response) {
    // Amazon Cognito creates a session which includes the id, 
    // access, and refresh tokens of an authenticated user.
    const { username, password } = request.body;

    var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const resultObjectt = {
                accessToken: result.getAccessToken().getJwtToken(),
                idToken: result.idToken.jwtToken
            }
            /* Use the idToken for Logins Map when Federating User Pools 
            with identity pools or when passing through an Authorization Header 
            to an API Gateway Authorizer 
            */
           response.status(200).send(resultObjectt);
        },

        onFailure: function(error) {
            response.status(400).send(error);
        },

    });
});

/**
 * Forgot Password
 */
app.put("/mobile-auth/forgotpassword", function(request, response) {});

/**
 * Reset Password
 */
app.put("/mobile-auth/resetpassword/:id", function(request, response) {});

/**
 * SMS CONFIRM USER
 */
app.put("/mobile-auth/confirmationcode/:id", function(request, response) {
    const { username, confirmationCode } = request.body;
    
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool,
    };
    
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(confirmationCode, true, function(error, result) {
        if (error) {
            response.status(400).send(JSON.stringify(error))
        }
        response.status(200).send(result);
    });
});

/**
 * Resend SMS Confirmation Code
 */
app.post("/mobile-auth/resendconfirmationcode/:id", function(request, response) {
    const { username } = request.body;

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.resendConfirmationCode(function(error, result) {
        if (error) {
            response.status(400).send(JSON.stringify(error))
        }
        response.status(200).send(result);
    });
});

/**
 * FACEBOOK
 */
app.delete("/mobile-auth/facebook:id", function(request, response) {});

/**
 * GOOGLE
 */
app.post("/mobile-auth/google:id", function(request, response) {});


/**
 * DELETE 
 */
app.delete("/mobile-auth/:id", function(request, response) {});
      
module.exports.handler = serverless(app);

