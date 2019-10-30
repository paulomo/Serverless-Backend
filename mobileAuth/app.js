// Require AWS, Express
const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");

// AWS Services
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3(require("./s3config.js")());

// configure express
const app = express();
app.use(bodyParser.json({ strict: false }));


module.exports = async () => {
    app.get("/users/health", function(req, res) {});
    
    /**
     * Get user attributes
     */
    app.get("/users/:userId", function(req, res) {});
    
    /**
     * Get a list of users using a tenant id to scope the list
     */
    app.get("/users", function(req, res) {});
    
    /**
     * Get a list of users using a tenantId and locationId to scope the list
     */
    app.get("/users", function(req, res) {});
    
    /**
     * Create a new user
     */
    app.post("/users/create", function(req, res) {});
    
    /**
     * Enable a user that is currently disabled
     */
    app.put("/users/enable", function(req, res) {});
    
    /**
     * Disable a user that is currently enabled
     */
    app.put("/users/disable", function(req, res) {});
    
    /**
     * Update a user's attributes
     */
    app.put("/users", function(req, res) {});
    
    /**
     * Delete a user
     */
    app.delete("/users/:userId", function(req, res) {});
      

};

AWSCognito.config.region = 'us-east-1'; //This is required to derive the endpoint

var poolData = { UserPoolId : 'us-east-1_TcoKGbf7n',
    ClientId : '4pe2usejqcdmhi0a25jp4b5sh3'
};
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

var attributeList = [];

var dataEmail = {
    Name : 'email',
    Value : 'email@mydomain.com'
};
var dataPhoneNumber = {
    Name : 'phone_number',
    Value : '+15555555555'
};
var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

attributeList.push(attributeEmail);
attributeList.push(attributePhoneNumber);

userPool.signUp('username', 'password', attributeList, null, function(err, result){
    if (err) {
        alert(err);
        return;
    }
    cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
});

var authenticationData = {
    Username : 'username',
    Password : 'password'
};
var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
var poolData = { UserPoolId : 'us-east-1_TcoKGbf7n',
    ClientId : '4pe2usejqcdmhi0a25jp4b5sh3'
};
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var userData = {
   Username : 'username',
   Pool : userPool
};
var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
   cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
         console.log('access token + ' + result.getAccessToken().getJwtToken());
     /* Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer */
    console.log('idToken + ' + result.idToken.jwtToken);
   },
   onFailure: function(err) {
      alert(err);
   },
});