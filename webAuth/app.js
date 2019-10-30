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
    app.get("/brands/health", function(req, res) {});
      
    /**
     * WARNING: THIS WILL REMOVE THE DYNAMODB TABLES FOR THIS QUICKSTART.
     * NOTE: In production, it is recommendended to have a backup of all Tables, and only manage these tables from corresponding micro-services.
     * Delete DynamoDB Tables required for the Infrastructure including the User, Tenant, Product, and Order Tables.
     */
    app.delete("/brands/tables", function(req, res) {});
    
    /**
     * WARNING: THIS WILL REMOVE ALL THE COGNITO USER POOLS, IDENTITY POOLS, ROLES, AND POLICIES CREATED BY THIS QUICKSTART.
     * Delete Infrastructure Created by Multi-tenant Identity Reference Architecture
     */
    app.delete("/brands/tenants/:tenantId", function(req, res) {});

    /**
     * WARNING: THIS WILL REMOVE ALL THE COGNITO USER POOLS, IDENTITY POOLS, ROLES, AND POLICIES CREATED BY THIS QUICKSTART.
     * Delete Infrastructure Created by Multi-tenant Identity Reference Architecture
     */
    app.delete("/brands/tenants/:tenantId/location/:locationId", function(req, res) {});
    
    /**
     * Lookup user pool for any user
     */
    app.get("/brands/pool/:id", function(req, res) {});
    
    /**
     * Get user attributes from a tenant
     */
    app.get("/brands/tenant/:tenantId:/user/:userId", function(req, res) {});
    
    /**
     * Get a list of users from a tenant
     */
    app.get("/brands/tenant/:tenantId/users", function(req, res) {});
    
    /**
     * Get list of locations using a tenantId and locationId
     */
    app.get("/brands/tenant/:tenantId/location/:locationId", function(req, res) {});
    
    /**
     * Create a new location
     */
    app.post("/brands/tenant/:tenantId/location", function(req, res) {});
    
    /**
     * Enable a tenant user that is currently disabled 
     */
    app.put("/brands/tenant/:tenantId/user/:userid", function(req, res) {});
    
    /**
     * Disable a tenant user that is currently enabled
     */
    app.put("/brands/tenant/:tenantId/user/:userid", function(req, res) {});

    /**
     * Enable a location user that is currently disabled
     */
    app.put("/brands/tenant/:tenantId/location/:locationId/user/:userid", function(req, res) {});
    
    /**
     * Disable a location user that is currently enabled
     */
    app.put("/brands/tenant/:tenantId/location/:locationId/user/:userid", function(req, res) {});
    
    /**
     * Update a user's attributes
     */
    app.put("/brands/tenant/:tenantId/user/:userid", function(req, res) {});
    
    /**
     * Delete a user tenant
     */
    app.delete("/brands/tenant/:tenantId/user/:userid", function(req, res) {});

    /**
     * Delete a user location
     */
    app.delete("/brands/tenant/:tenantId/location/:locationId/user/:userid", function(req, res) {});
      

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