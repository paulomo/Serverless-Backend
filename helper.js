const jwtDecode = require("jwt-decode");
const request = require("request");
const async = require("async");
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

var docClient = new AWS.DynamoDB.DocumentClient();

// ******************************* TOKEN *********************************

/**
 * Extract an id token from a request, decode it and extract the tenant
 * id from the token.
 * @param req A request
 * @returns A tenant Id
 */
function getTenantId(req) {
  var tenantId = "";
  var bearerToken = req.get("Authorization");
  if (bearerToken) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) tenantId = decodedIdToken["custom:tenant_id"];
  }
  return tenantId;
}

function getLocationId(req) {
  var tenantId = "";
  var bearerToken = req.get("Authorization");
  if (bearerToken) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) tenantId = decodedIdToken["custom:location_id"];
  }
  return tenantId;
}

/**
 * Extract non PII info from Token
 * @param req A request
 * @returns JSON Object without PII
 */
function extractTokenData(req) {
  var tokenData;
  var bearerToken = req.get("Authorization");
  if (bearerToken) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) {
      tokenData.TenantID = decodedIdToken["custom:tenant_id"];
      tokenData.LocationID = decodedIdToken["custom:location_id"];
      //Add Other Mappings Below
      //others such as sub, and non pii information
    }
  }
  return tokenData;
}

/**
 * Extract an id token from a request, decode it and extract the user role
 * id from the token.
 * @param req A request
 * @returns A role
 */
async function getUserRole(req) {
  var bearerToken = req.get("Authorization");
  if (bearerToken) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) return decodedIdToken["custom:role"];
    else return "unkown";
  }
}

/**
 * Decode and token and extract the user's full name from
 * the token.
 * @param idToken A bearer token
 * @returns The user's full name
 */
function getUserFullName(idToken) {
  var userFullName = "";
  if (idToken) {
    var decodedIdToken = jwtDecode(idToken);
    if (decodedIdToken)
      userFullName = {
        firstName: decodedIdToken.given_name,
        lastName: decodedIdToken.family_name
      };
  }
  return userFullName;
}

/**
 * Get the authorization token from a request
 * @param req The request with the authorization header
 * @returns The user's email address
 */
function getRequestAuthToken(req) {
  authToken = "";
  var authHeader = req.get("Authorization");
  if (authHeader)
    var authToken = authHeader.substring(authHeader.indexOf(" ") + 1);
  return authToken;
}

// ******************************* DYNAMODB *********************************

async function addItem(data, credentials) {
  try {
    const response = await docClient.put(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
}

async function getItem(params) {
  try {
    const response = await docClient.get(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
}

async function updateItem(params) {
  try {
    const response = await docClient.update(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
}

async function deleteItem(params) {
  try {
    const response = await docClient.delete(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
}
