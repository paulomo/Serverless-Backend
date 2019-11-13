const jwtDecode = require("jwt-decode"); // may not use
const jwt = require("jsonwebtoken");
const { ValidationError } = require("./error");


// ******************************* TOKEN *********************************

/**
 * Extract an id token from a request, decode it and extract the tenant
 * id from the token.
 * @param request A request from the header
 * @returns A tenant Id
 */
module.exports.getTenantId = function(request) {
  var tenantId = "";
  const token = getToken(request);
  if (!token.isEmpty()) {
    const decodedIdToken = jwt.decode(token);
    if (decodedIdToken) {
      tenantId = decodedIdToken["custom:tenant_id"];
      return tenantId;
    }
  }
};

/**
 * Extract an id token from a request, decode it and extract the tenant
 * id from the token.
 * @param request A request
 * @returns A tenant Id
 */
module.exports.getLocationId = function(request) {
  var locationId = "";
  const token = getToken(request);
  if (!token.isEmpty()) {
    const decodedIdToken = jwtDecode(token);
    if (decodedIdToken) {
      locationId = decodedIdToken["custom:location_id"];
      return locationId;
    }
  } else {
    return "unknown";
  }
};

/**
 * Extract an id token from a request, decode it and extract the user role
 * id from the token.
 * @param request A request
 * @returns A role
 */
module.exports.getRole = function(request) {
  const token = getToken(request);
  if (!token.isEmpty()) {
    const decodedIdToken = jwtDecode(token);
    if (decodedIdToken) {
      const role = decodedIdToken["custom:role"];
      return role;
    } else {
      return "unkown";
    }
  }
};

/**
 * @param request The http request
 * @returns JSON Object
 */
module.exports.extractTokenData = function(request) {
  var tokenData = {};
  const token = getToken(request);
  if (!token.isEmpty()) {
    const decodedIdToken = jwtDecode(token);
    if (decodedIdToken) {
      tokenData.tenantID = decodedIdToken["custom:tenant_id"];
      tokenData.locationID = decodedIdToken["custom:location_id"];
      tokenData.location = decodedIdToken["custom:location"];
      tokenData.role = decodedIdToken["custom:role"];
      tokenData.companyName = decodedIdToken["custom:company_name"];
      tokenData.tenantFaunadbSecret =
        decodedIdToken["custom:tenant_faunadb_secret"];
      tokenData.tenantFaunadbHash =
        decodedIdToken["custom:tenant_faunadb_hash"];
    }
  }
  return tokenData;
};

/**
 * Decode and token and extract the user's full name from
 * the token.
 * @param request A bearer token
 * @returns The user's full name
 */
module.exports.getUserFullName = function(request) {
  var userFullName = "";
  const token = getToken(request);
  if (!token.isEmpty()) {
    var decodedIdToken = jwtDecode(token);
    if (decodedIdToken)
      userFullName = {
        firstName: decodedIdToken.given_name,
        lastName: decodedIdToken.family_name
      };
  }
  return userFullName;
};

/**
 * @param request from the http
 * @returns a token string
 */
module.exports.getAccessToken = function(request) {
  return getToken(request);
}

// ******************************* PRIVATE FUNCTIONS *********************************

/**
 * @param request from the http
 * @returns a token string
 */
function getToken(request) {
  var token =
    request.headers["x-access-token"] || request.headers["authorization"]; // Express headers are auto converted to lowercase;
  if (!token.isEmpty() && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    // bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    token = token.slice(7, token.length);
    return token;
  } else {
    throw new ValidationError("Token is Empty");
  }
}
