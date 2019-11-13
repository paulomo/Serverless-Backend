// Require AWS, Express
const AWS = require("aws-sdk");
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const utilToken = require('../util_token');

// configure express
const app = express();
app.use(bodyParser.json({ strict: false }));

AWSCognito.config.region = 'us-east-1'; //This is required to derive the endpoint

// Configure UserPool
const COGNITO_USER_POOL_MOBILE = process.env.COGNITO_USER_POOL_MOBILE;
const CLIENT_APP_ID_MOBILE = process.env.CLIENT_APP_ID_MOBILE;

const poolData = { 
    UserPoolId : COGNITO_USER_POOL_MOBILE,
    ClientId : CLIENT_APP_ID_MOBILE
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

    const dataEmail = {
        Name : 'email',
        Value : username
    };
    const dataPhone = {
        Name : 'phone_number',
        Value : phoneNumber
    };
    const firstName = {
        Name : 'given_name',
        Value : firstName
    };
    const attributePhone = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
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
app.post("/mobile-auth/signin", function(request, response) {
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
            const resultObject = {
                accessToken: result.getAccessToken().getJwtToken(),
                idToken: result.idToken.jwtToken
            }
            /* Use the idToken for Logins Map when Federating User Pools 
            with identity pools or when passing through an Authorization Header 
            to an API Gateway Authorizer 
            */
           response.status(200).send(resultObject);
        },
        onFailure: function(error) {
            response.status(400).send(error);
        },
    });
});

/**
 * Forgot Password
 */
app.put("/mobile-auth/forgotpassword", function(request, response) {
    const { username } = request.body;
    
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool,
    };
    
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.forgotPassword({
        onSuccess: function(data) {
            // successfully initiated reset password request
            response.status(200).send(JSON.stringify(data));
        },
        onFailure: function(error) {
            response.status(400).send(JSON.stringify(error));
        },
        //Optional automatic callback
        inputVerificationCode: function(data) {
            response.status(200).send(JSON.stringify(data));
            console.log('Code sent to: ' + data);
            var code = document.getElementById('code').value;
            var newPassword = document.getElementById('new_password').value;
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess() {
                    console.log('Password confirmed!');
                },
                onFailure(err) {
                    console.log('Password not confirmed!');
                },
            });
        },
    });
});

/**
 * Reset Password
 */
app.put("/mobile-auth/resetpassword", function(request, response) {
    const { username, oldPassword, newPassword } = request.body;
    
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool,
    };
    
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.changePassword(oldPassword, newPassword, function(error, result) {
        if (error) {
            response.status(400).send(JSON.stringify(error));
        }
        response.status(200).send(result);
    });
});

/**
 * SMS CONFIRM USER
 */
app.put("/mobile-auth/confirmationcode", function(request, response) {
    const { username, confirmationCode } = request.body;
    
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool,
    };
    
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(confirmationCode, true, function(error, result) {
        if (error) {
            response.status(400).send(JSON.stringify(error));
        }
        response.status(200).send(result);
    });
});

/**
 * Resend SMS Confirmation Code
 */
app.post("/mobile-auth/resendconfirmationcode", function(request, response) {
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
app.post("/mobile-auth/facebook", function(request, response) {});

/**
 * GOOGLE
 */
app.post("/mobile-auth/google", function(request, response) {
    const { token } = request.body;
});


/**
 * DELETE 
 */
app.delete("/mobile-auth/:id", function(request, response) {
    const { accessToken } = utilToken.getAccessToken(request);
    var params = {
        AccessToken: accessToken
      };
      cognitoidentityserviceprovider.deleteUser(params, function(error, data) {
        if (error) {
            response.status(400).send(error); // an error occurred
        } else {    
            response.status(200).send(data);
        }
      });
});

/**
 * DELETE 
 */
app.post("/mobile-auth/signout", async function(request, response) {
    const { username } = request.body;

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    const result = await cognitoUser.signOut();
    response.status(200).send(result);
});

      
module.exports.handler = serverless(app);

