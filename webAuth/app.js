const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const winston = require('winston');

// Get authHelper 
const webAuthHelper = require("../web_auth_helper");

// Configure UserPool
const COGNITO_USER_POOL_WEB = process.env.COGNITO_USER_POOL_WEB;
const CLIENT_APP_ID_WEB = process.env.CLIENT_APP_ID_WEB;


// configure express
const app = express();
app.use(bodyParser.json({ strict: false }));

/**
 * Signup a new tenant
 * @returns the new tenant including faunadb database access
 */
app.post("/tenant/signup", async function(request, response) {
  var tenant = request.body;

  // checking for unique tenant name
  const isExist = await webAuthHelper.checkUniqueTenantNameOnSignUp(tenant);
  // return error with message

  // Generate the tenant and location id
  tenant.id = tenant.tenant_name.toUpperCase() + "-" + uuidV4();
  location.id = tenant.tenant_name.toUpperCase() + "-headOffice-" + uuidV4();
  winston.debug("Creating Tenant ID: " + tenant.id);
  winston.debug("Creating Location ID: " + location.id);

  // search params
  var searchParams = {
    AttributesToGet: ["email", "tenant_name"],
    Filter: "email",
    UserPoolId: COGNITO_USER_POOL_WEB
  };

  // search for tenat/user
  const user = await webAuthHelper.userExist(searchParams);

  // see if user already exist
  if (user.data !== null) {
    winston.error("User already exist");
    response.status(400).send("User Already Exist");
  } else {
    try {
      const tenantResult = await webAuthHelper.registerTenantAdmin(tenant);
      // create database and store tenant data, returns a secret/other data from the collection
      const responseDB = await webAuthHelper.saveTenantDataToFaunadb(tenantResult);
      const userObject = await webAuthHelper.updateTenantUserWithFaunaRecords(responseDB);
      response.status(200).send(userObject);
    } catch (error) {
      response.status(400).send(error);
    }
  }
});

/**
 * Signin a new tenant
 */
app.post("/tenant/signin", async function(request, response) {
  var tenant = request.body;
  winston.debug("Signing in A User");
  try {
    const result = await webAuthHelper.signInTenant(tenant);
    response.status(200).send(result);
  }catch(error){
    response.status(400).send(error);
  }
});

/**
 * Signout a new tenant
 */
app.post("/tenant/signout", async function(request, response) {
  var tenant = request.body;
  winston.debug();
  try {
    const result = await webAuthHelper.signout(tenant);
    response.status(200).send(result);
  }catch(error){
    response.status(400).send(error);
  }
});

/**
 * Forgot Password for tenant
 */
app.post("/tenant/forgotpassword", async function(request, response) {
  var tenant = request.body;
  winston.debug();
  try {
    const result = await webAuthHelper.forgotPassword(tenant);
    response.status(200).send(result);
  }catch(error){
    response.status(400).send(error);
  }

});

/**
 * Register a new tenant
 */
app.post("/tenant/resetpassword", async function(request, response) {
  var tenant = request.body;
  winston.debug();
  try {
    const result = await webAuthHelper.resetPassword(tenant);
    response.status(200).send(result);
  }catch(error){
    response.status(400).send(error);
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
    UserPoolId: COGNITO_USER_POOL_WEB
  };

  // search for user
  try {
    const result = await webAuthHelper.userExist(searchParams);
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
    UserPoolId: COGNITO_USER_POOL_WEB
  };

  // search for user
  try {
    const result = await webAuthHelper.userExist(searchParams);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
  }
});

/**
 * Get a list of users from a tenant
 */
app.get("/tenant/users", async function(request, response) {
  const { TenantID, CompanyName } = webAuthHelper.extractTokenData(request);

  // search params
  var searchParams = {
    AttributesToGet: ["company_name", "tenant_id"],
    Filter: "",
    UserPoolId: COGNITO_USER_POOL_WEB
  };

  // search for user
  try {
    const result = await webAuthHelper.userExist(searchParams);
    const data = webAuthHelper.tenantUsers(result, TenantID, CompanyName);
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send(error);
  }
});

/**
 * Get a list of users from a location
 */
app.get("/tenant/location/users", async function(request, response) {
  const { TenantID, LocationId, CompanyName  } = webAuthHelper.extractTokenData(request);

  // search params
  var searchParams = {
    AttributesToGet: ["company_name", "tenant_id", "location_id"],
    Filter: "",
    UserPoolId: COGNITO_USER_POOL_WEB
  };

  // search for and return tenat users
  try {
    const result = await webAuthHelper.userExist(searchParams);
    const data = webAuthHelper.tenantUsers(result, TenantID, LocationId, CompanyName);
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send(error);
  }
});

/**
 * Enable a Disable User
 */
app.post("/tenant/enable-user", async function(request, response) {
  const { tenant } = request.body;
  winston.debug();
  try {
    const result = await webAuthHelper.enableUser(tenant);
    response.status(200).send(result);
  }catch(error){
    response.status(400).send(error);
  }
});

/**
 * Disable a User
 */
app.post("/tenant/disable-user", async function(request, response) {
  const { tenant } = request.body;
  winston.debug();
  try {
    const result = await webAuthHelper.disableUser(tenant);
    response.status(200).send(result);
  }catch(error){
    response.status(400).send(error);
  }
});

module.exports.handler = serverless(app);


