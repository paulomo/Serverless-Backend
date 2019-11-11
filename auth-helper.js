const AWS = require("aws-sdk");
const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const config = require("config");


// Setup FaunaDB
var faunadb = require("faunadb"),
  q = faunadb.query;
const FAUNADB_SECRET = process.env.FAUNADB_SECRET;
var client = new faunadb.Client({ secret: FAUNADB_SECRET });

// AWS Services
const S3 = new AWS.S3(require("./s3config.js")());
AWS.config.update({ region: "us-east-1" });

const cognitoUserPoolID = process.env.COGNITO_USER_POOL;
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});

// ******************************* TOKEN *********************************


/**
 * ID token contains the user fields defined in the Amazon Cognito user pool.
 * JWT tokens include three sections: a header, payload, and signature.
 * Extract an id token from a request, decode it and extract the tenant
 * id from the token.
 * @param request A request
 * @returns A token if valid or error message
 */
module.exports.getAuthToken = function(request) {
  //get the token from the header if present
  const token = request.headers["x-access-token"] || request.headers["authorization"];
  if (!token) return "Access denied. No token provided.";
  try {
    const decoded = jwt.verify(token, config.get("myprivatekey"));
    return decoded;
  } catch (error) {
    //if invalid token
    return "Invalid token.";
  }
};

/**
 * Extract an id token from a request, decode it and extract the tenant
 * id from the token.
 * @param req A request
 * @returns A tenant Id
 */
module.exports.getTenantId = function(request) {
  var tenantId = "";
  var bearerToken = request.get("Authorization");
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
module.exports.getLocationId = function(request) {
  var locationId = "";
  var bearerToken = request.get("Authorization");
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
module.exports.extractTokenData = function(request) {
  var tokenData = {};
  var bearerToken = request.get("Authorization");
  if (bearerToken) {
    bearerToken = bearerToken.substring(bearerToken.indexOf(" ") + 1);
    var decodedIdToken = jwtDecode(bearerToken);
    if (decodedIdToken) {
      tokenData.TenantID = decodedIdToken["custom:tenant_id"];
      tokenData.LocationID = decodedIdToken["custom:location_id"];
      tokenData.Location = decodedIdToken["custom:location"];
      tokenData.CompanyName = decodedIdToken["custom:company_name"];
      tokenData.Location = decodedIdToken["custom:tenant_faunadb"];
      tokenData.CompanyName = decodedIdToken["custom:tenant_faunadb_hash"];
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
    onSuccess: function (result) {
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
        cognitoUser.completeNewPasswordChallenge(newPassword, attributesData, this)
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
  const secretKey = await client.query(q.CreateKey({ database: q.Database(dbName.name), role: "admin" }));
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
    tenant_faunadb: secretKey.secret, // getting the secret returned from the createKey function
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
 * Save the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The updated tenant
 */
/**
 * 
 */
module.exports.updateTenantUserWithFaunaRecords = async function(tenant) {
  // const tenantDbData = await client.query(q.Match(q.Index(company_name + "TENANT")));
  // Get tenant_faunadb, tenant_faunadb_hash from FaunaDB User
  const { email, tenant_faunadb, tenant_faunadb_hash } = tenant.data;
  var params = {
    UserAttributes: [
      {
        Name: `custom:${tenant_faunadb}`,
        Value: tenant_faunadb
      },
      {
        Name: `custom:${tenant_faunadb_hash}`,
        Value: tenant_faunadb_hash
      },
    ],
    UserPoolId: cognitoUserPoolID,
    Username: email,
  };
  try {
    const result = await cognitoidentityserviceprovider.adminUpdateUserAttributes(params);
    return result;
  }catch(error){
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

/**
 * 
 */
module.exports.checkId = function(data) {
  const { id } = data;
  if (typeof id !== "string") {
    return { message: '"Id" must be a string', code: 400 };
  } 
}




// // ID token contains the user fields defined in the Amazon Cognito user pool.
// // JWT tokens include three sections: a header, payload, and signature.

// module.exports = function(req, res, next) {
//   //get the token from the header if present
//   const token = req.headers["x-access-token"] || req.headers["authorization"];
//   //if no token found, return response (without going to the next middelware)
//   if (!token) return res.status(401).send("Access denied. No token provided.");

//   try {
//     //if can verify the token, set req.user and pass to next middleware
//     const decoded = jwt.verify(token, config.get("myprivatekey"));
//     req.user = decoded;
//     next();
//   } catch (ex) {
//     //if invalid token
//     res.status(400).send("Invalid token.");
//   }
// };