const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const winston = require('winston');

// Get authHelper 
const authHelper = require("../auth-helper");

const cognitoUserPoolID = process.env.COGNITO_USER_POOL;

// configure express
const app = express();
app.use(bodyParser.json({ strict: false }));

/**
 * Register a new tenant
 */
app.post("/tenant/signup", async function(request, response) {
  var tenant = request.body;
  // Generate the tenant and location id
  tenant.id = tenant.companyName.toUpperCase() + "-" + uuidV4();
  location.id = tenant.companyName.toUpperCase() + "-headOffice-" + uuidV4();
  winston.debug("Creating Tenant ID: " + tenant.id);
  winston.debug("Creating Location ID: " + location.id);
  // search params
  var searchParams = {
    AttributesToGet: ["email", "company_name"],
    Filter: "email",
    UserPoolId: cognitoUserPoolID /* required */
  };

  // search for tenat/user
  const user = await authHelper.userExist(searchParams);
  // see if user already exist
  if (user.data !== null) {
    winston.error("User already exist");
    response.status(400).send("User Already Exist");
  } else {
    try {
      const tenantResult = await authHelper.registerTenantAdmin(tenant);
      // create database and store tenant data, returns a secret/other data from the collection
      const responseDB = await authHelper.saveTenantDataToFaunadb(tenantResult);
      const userObject = await authHelper.updateTenantUserWithFaunaRecords(responseDB);
      response.status(200).send(userObject);
    } catch (error) {
      response.status(400).send(error);
    }
  }
});

/**
 * Lookup user pool for any user
 */
app.get("/tenat/user-lookup/:userId", async function(request, response) {
  const userId = request.params.userId;
  
  // search params
  var searchParams = {
    AttributesToGet: ["email", "company_name", , "tenant_id", "location_id"],
    Filter: `"email = ${userId}"`,
    UserPoolId: cognitoUserPoolID /* required */
  };

  // search for user
  try {
    const result = await authHelper.userExist(searchParams);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
  }
});

/**
 * Get user attributes from a tenant
 */
app.get("/tenant/user-attribute/:userId", async function(request, response) {
  const userId = request.params.userId;

  // search params
  var searchParams = {
    AttributesToGet: ["email", "company_name", , "tenant_id", "location_id"],
    Filter: `"email = ${userId}"`,
    UserPoolId: cognitoUserPoolID /* required */
  };

  // search for user
  try {
    const result = await authHelper.userExist(searchParams);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
  }
});

/**
 * Get a list of users from a tenant
 */
app.get("/tenant/users", async function(request, response) {
  const { TenantID, CompanyName } = authHelper.extractTokenData(request);

  // search params
  var searchParams = {
    AttributesToGet: ["company_name", "tenant_id"],
    Filter: "",
    UserPoolId: cognitoUserPoolID /* required */
  };

  // search for user
  try {
    const result = await authHelper.userExist(searchParams);
    const data = authHelper.tenantUsers(result, TenantID, CompanyName);
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send(error);
  }
});

/**
 * Get a list of users from a location
 */
app.get("/tenant/location/users", async function(request, response) {
  const { TenantID, LocationId, CompanyName  } = authHelper.extractTokenData(request);

  // search params
  var searchParams = {
    AttributesToGet: ["company_name", "tenant_id", "location_id"],
    Filter: "",
    UserPoolId: cognitoUserPoolID 
  };

  // search for and return tenat users
  try {
    const result = await authHelper.userExist(searchParams);
    const data = authHelper.tenantUsers(result, TenantID, LocationId, CompanyName);
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send(error);
  }
});

/**
 * Enable a Disable User
 */
app.post("/tenant/enable-user", async function(request, response) {});

/**
 * Disable a User
 */
app.post("/tenant/disable-user", async function(request, response) {});

module.exports.handler = serverless(app);


