const AWS = require("aws-sdk");
const jwtDecode = require("jwt-decode");

AWS.config.update({
  region: "us-east-1"
});

const cognitoUserPoolID = process.env.COGNITO_USER_POOL;
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});

const cognitoUserPoolID = process.env.COGNITO_USER_POOL;

// ******************************* TOKEN *********************************

/**
 * Extract an id token from a request, decode it and extract the tenant
 * id from the token.
 * @param req A request
 * @returns A tenant Id
 */
module.exports.getTenantId = function(req) {
  var tenantId = "";
  var bearerToken = req.get("Authorization");
  if (bearerToken !== null) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) tenantId = decodedIdToken["custom:tenant_id"];
  }
  return tenantId;
};

/**
 * Extract an id token from a request, decode it and extract the tenant
 * id from the token.
 * @param req A request
 * @returns A tenant Id
 */
module.exports.getLocationId = function(req) {
  var locationId = "";
  var bearerToken = req.get("Authorization");
  if (bearerToken) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) tenantId = decodedIdToken["custom:location_id"];
  }
  return locationId;
};

/**
 * Extract non PII info from Token
 * @param req A request
 * @returns JSON Object without PII
 */
module.exports.extractTokenData = function(req) {
  var tokenData;
  var bearerToken = req.get("Authorization");
  if (bearerToken) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) {
      tokenData.TenantID = decodedIdToken["custom:tenant_id"];
      tokenData.LocationID = decodedIdToken["custom:location_id"];
      tokenData.Location = decodedIdToken["custom:location"];
      tokenData.CompanyName = decodedIdToken["custom:company_name"];
      //Add Other Mappings Below
      //others such as sub, and non pii information
    }
  }
  return tokenData;
};

/**
 * Extract an id token from a request, decode it and extract the user role
 * id from the token.
 * @param req A request
 * @returns A role
 */
module.exports.getUserRole = function(req) {
  var bearerToken = req.get("Authorization");
  if (bearerToken) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) return decodedIdToken["custom:role"];
    else return "unkown";
  }
};

/**
 * Decode and token and extract the user's full name from
 * the token.
 * @param idToken A bearer token
 * @returns The user's full name
 */
module.exports.getUserFullName = function(idToken) {
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
};

/**
 * Get the authorization token from a request
 * @param req The request with the authorization header
 * @returns The user's email address
 */
module.exports.getRequestAuthToken = function(req) {
  authToken = "";
  var authHeader = req.get("Authorization");
  if (authHeader)
    var authToken = authHeader.substring(authHeader.indexOf(" ") + 1);
  return authToken;
};

// ******************************* HELPERS *********************************

/**
 * Determine if a tenant can be created (they may already exist)
 * @param tenant The tenant data
 * @returns True if the tenant exists
 */
module.exports.userExist = function(params) {
  cognitoidentityserviceprovider.listUsers(params, function(err, data) {
    if (err) {
      return err; // an error occurred
    } else {
      return data; // successful response
    }
  });
};

/**
 * Register a new tenant user and provision policies for that user
 * @param tenant The new tenant data
 * @returns {Promise} Results of tenant provisioning
 */
module.exports.registerTenantAdmin = function(tenant) {
  var params = {
    UserPoolId: cognitoUserPoolID /* required */,
    Username: tenant.username /* required */,
    DesiredDeliveryMediums: [
      "EMAIL"
      /* more items */
    ],
    ForceAliasCreation: true,
    MessageAction: "RESEND",
    // TemporaryPassword: tempPassword,
    UserAttributes: [
      {
        Name: "email",
        Value: tanant.email
      },
      {
        Name: "custom:tenant_id",
        Value: tenant.tenant_id
      },
      {
        Name: "custom:location_id",
        Value: tenant.location_id
      },
      {
        Name: "custom:location",
        Value: tenant.location
      },
      {
        Name: "given_name",
        Value: tenant.firstName
      },
      {
        Name: "family_name",
        Value: tenant.lastName
      },
      {
        Name: "custom:role",
        Value: tenant.role
      },
      {
        Name: "custom:company_name",
        Value: tenant.companyName
      },
      {
        Name: "custom:tier",
        Value: tenant.tier
      }
    ]
  };
  cognitoidentityserviceprovider.adminCreateUser(params, function(err, data) {
    if (err) {
      return JSON.stringify(error); // an error occurred
    } else {
      return JSON.stringify(data); // successful response
    }
  });
};

/**
 * Save the configration and status of the new tenant
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.saveTenantData = function(tenant) {
  var promise = new Promise(function(resolve, reject) {
    // init the tenant sace request
    var tenantRequestData = {
      id: tenant.id,
      companyName: tenant.companyName,
      accountName: tenant.accountName,
      ownerName: tenant.ownerName,
      tier: tenant.tier,
      email: tenant.email,
      status: "Active",
      UserPoolId: tenant.UserPoolId,
      IdentityPoolId: tenant.IdentityPoolId,
      systemAdminRole: tenant.systemAdminRole,
      systemSupportRole: tenant.systemSupportRole,
      trustRole: tenant.trustRole,
      systemAdminPolicy: tenant.systemAdminPolicy,
      systemSupportPolicy: tenant.systemSupportPolicy,
      userName: tenant.userName
    };

    // fire request
    request(
      {
        url: tenantURL,
        method: "POST",
        json: true,
        headers: { "content-type": "application/json" },
        body: tenantRequestData
      },
      function(error, response, body) {
        if (error || response.statusCode != 200) reject(error);
        else resolve(body);
      }
    );
  });

  return promise;
};

module.exports.tenantUsers = async function(data, tenantId, companyName) {
  var tenantUsers = {};
  const { Attributes } = data;
  if (
    Attributes.tenant_id === tenantId &&
    Attributes.company_name === companyName
  ) {
    tenantUsers.tenant_id = Attributes.tenant_id;
    tenantUsers.company_name = Attributes.company_name;
    return tenantUsers;
  }
};

module.exports.locationUsers = async function(
  data,
  tenantId,
  locationId,
  companyName
) {
  var locationUsers = {};
  const { Attributes } = data;
  if (
    Attributes.tenant_id === tenantId &&
    Attributes.location_id === locationId &&
    Attributes.company_name === companyName
  ) {
    tenantUsers.tenant_id = Attributes.tenant_id;
    tenantUsers.company_name = Attributes.company_name;
    return locationUsers;
  }
};
