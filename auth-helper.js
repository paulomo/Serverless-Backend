const AWS = require("aws-sdk");
const jwtDecode = require("jwt-decode"); // may not use
const jwt = require("jsonwebtoken");
const { ValidationError } = require('./error')

// Setup FaunaDB
var faunadb = require("faunadb"), q = faunadb.query;
const FAUNADB_SECRET = process.env.FAUNADB_SECRET;
var client = new faunadb.Client({ secret: FAUNADB_SECRET });

// AWS Services
AWS.config.update({ region: "us-east-1" });

const cognitoUserPoolID = process.env.COGNITO_USER_POOL;
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});

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

// ******************************* HELPERS *********************************

/**
 * Determine if a tenant can be created (they may already exist)
 * @param params The tenant data
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
    UserPoolId: cognitoUserPoolID,
    Username: tenant.Username,
    DesiredDeliveryMediums: [
      "EMAIL"
      /* more items */
    ],
    ForceAliasCreation: true,
    MessageAction: "RESEND",
    UserAttributes: [
      {
        Name: "email",
        Value: tanant.Username
      },
      {
        Name: "prefferedName",
        Value: tenant.CompanyName
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
        Name: "custom:tenant_faunadb",
        Value: ""
      },
      {
        Name: "custom:tier",
        Value: tenant.tier
      },
      {
        Name: "custom:tenant_faunadb_hash",
        Value: ""
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
 * Authenticate a tenant user
 * @param tenant The new tenant data
 * @returns {Promise} Results of tenant provisioning
 */
module.exports.signInTenant = function(data) {
  const authenticationData = {
    Username: data.email,
    Password: data.password
  };
  cognitoUser.authenticateUser(authenticationData, {
    onSuccess: function(result) {
      // User authentication was successful
    },

    onFailure: function(err) {
      // User authentication was not successful
    },

    newPasswordRequired: function(userAttributes, requiredAttributes) {
      // User was signed up by an admin and must provide new
      // password and required attributes, if any, to complete
      // authentication.

      // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user.
      // Required attributes according to schema, which don’t have any values yet, will have blank values.
      // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.

      // Get these details and call
      // newPassword: password that user has given
      // attributesData: object with key as attribute name and value that the user has given.
      cognitoUser.completeNewPasswordChallenge(
        newPassword,
        attributesData,
        this
      );
    }
  });
};

/**
 * Save the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.saveTenantDataToFaunadb = async function(tenant) {
  // get the tenant company_name
  const { company_name } = tenant.User.Attributes;
  // create the database with the company_name
  const dbName = await client.query(q.CreateDatabase({ name: company_name }));
  // create secret key to only access the collection
  const secretKey = await client.query(
    q.CreateKey({ database: q.Database(dbName.name), role: "admin" })
  );
  // create collection
  const collection = await CreateCollection({ name: "tenant-user" });
  // create index for the collection
  const index = await client.query(
    q.CreateIndex({
      name: company_name + "TENANT",
      source: q.Collection(collection)
    })
  );
  const data = {
    email: Attributes.email,
    tenant_id: Attributes.tenant_id,
    location_id: Attributes.location_id,
    location: Attributes.location,
    firstName: Attributes.firstName,
    lastName: Attributes.lastName,
    role: Attributes.role,
    companyName: Attributes.companyName,
    tenant_faunadb_secret: secretKey.secret, // getting the secret returned from the createKey function
    tenant_faunadb_hash: secretKey.hashed_secret, // getting the hashed_secret returned from the createKey function
    tier: Attributes.tier
  };
  // save the data to the database
  const savedData = await client.query(
    q.Create(q.Collection(collection), { data })
  );
  // return secret key
  return savedData;
};

/**
 * Update the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The updated tenant
 */
module.exports.updateTenantUserWithFaunaRecords = async function(tenant) {
  // const tenantDbData = await client.query(q.Match(q.Index(company_name + "TENANT")));
  // Get tenant_faunadb, tenant_faunadb_hash from FaunaDB User
  const { email, tenant_faunadb_secret, tenant_faunadb_hash } = tenant.data;
  var params = {
    UserAttributes: [
      {
        Name: `custom:${tenant_faunadb_secret}`,
        Value: tenant_faunadb
      },
      {
        Name: `custom:${tenant_faunadb_hash}`,
        Value: tenant_faunadb_hash
      }
    ],
    UserPoolId: cognitoUserPoolID,
    Username: email
  };
  try {
    const result = await cognitoidentityserviceprovider.adminUpdateUserAttributes(
      params
    );
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * @param data Data that is returned from Cognito; has the Attributes
 * @param tenantId The tenantId that is passed from the request header
 * @param companyName The company name that is passed via the request header
 * @returns TenantId and the Tenant Compant Name
 */
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

/**
 * @param data Data that is returned from Cognito; has the Attributes
 * @param tenantId The tenantId that is passed from the request header
 * @papram locationId The locationId that is passed from the request header
 * @param companyName The company name that is passed via the request header
 * @returns TenantId and the Tenant Compant Name
 */
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
    locationUsers.tenant_id = Attributes.tenant_id;
    locationUsers.company_name = Attributes.company_name;
    return locationUsers;
  }
};


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

