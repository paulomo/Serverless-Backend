const AWS = require("aws-sdk");

// Setup FaunaDB
var faunadb = require("faunadb"),
  q = faunadb.query;
const FAUNADB_SECRET = process.env.FAUNADB_SECRET;
var client = new faunadb.Client({ secret: FAUNADB_SECRET });

// AWS Services
AWS.config.update({ region: "us-east-1" });

const COGNITO_USER_POOL_WEB = process.env.COGNITO_USER_POOL_WEB;
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});


// ******************************* AUTHETICATION AND AUTORIZATION *********************************

/**
 * Register a new tenant user and provision policies for that user
 * @param tenant The new tenant data
 * @returns {Promise} Results of tenant provisioning
 */
module.exports.registerTenantAdmin = async function(tenant) {
  var params = {
    UserPoolId: COGNITO_USER_POOL_WEB,
    Username: tenant.Username,
    DesiredDeliveryMediums: [
      "EMAIL"
    ],
    ForceAliasCreation: true,
    MessageAction: "RESEND",
    UserAttributes: [
      {
        Name: "email",
        Value: tanant.Username
      },
      {
        Name: "preferred_username",
        Value: tenant.companyName
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
        Name: "custom:tenant_faunadb_secret",
        Value: ""
      },
      {
        Name: "custom:tier",
        Value: tenant.tier
      },
      {
        Name: "custom:tenant_faunadb_hash_secret",
        Value: ""
      }
    ]
  };
  try {
    const response = cognitoidentityserviceprovider.adminCreateUser(params);
    return response; // successful response
  }catch(error){
    return error; // an error occurred
  }
};

/**
 * Authenticate a tenant user
 * @param tenant The new tenant data
 * @returns {Promise} Results of tenant provisioning
 */
module.exports.signInTenant = async function(tenant) {
  const { email, password } = tenant;
  var params = {
    AuthFlow: ADMIN_NO_SRP_AUTH,
    ClientId: CLIENT_APP_ID,
    UserPoolId: COGNITO_USER_POOL_WEB,
    // AnalyticsMetadata: {
    //   AnalyticsEndpointId: 'STRING_VALUE'
    // },
    AuthParameters: {
      email: email,
      password: password
    }
  };
  try {
    const response = cognitoidentityserviceprovider.adminInitiateAuth(params);
    return response; // successful response
  } catch (error) {
    return error; // an error occurred
  }
};

/**
 * Save the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.forgotPassword = async function(tenant) {
  const { email } = tenant;
  var params = {
    ClientId: CLIENT_APP_ID,
    Username: email,
    // AnalyticsMetadata: {
    //   AnalyticsEndpointId: 'STRING_VALUE'
    // },
    UserContextData: {
      EncodedData: "STRING_VALUE"
    }
  };
  try {
    const response = cognitoidentityserviceprovider.forgotPassword(params);
    return response; // successful response
  } catch (error) {
    return error; // an error occurred
  }
};

/**
 * Reset the tenant password
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.resetPassword = async function(tenant) {
  const { accessToken, previousPassword, newPassword } = tenant;
  var params = {
    AccessToken: accessToken,
    PreviousPassword: previousPassword,
    ProposedPassword: newPassword
  };
  try {
    const response = cognitoidentityserviceprovider.changePassword(params);
    return response; // successful response
  } catch (error) {
    return error; // an error occurred
  }
};

/**
 * Enable User for a Tenant
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.enableUser = async function(tenant) {
  const { email } = tenant;
  var params = {
    UserPoolId: COGNITO_USER_POOL_WEB,
    Username: email
  };
  try {
    const response = cognitoidentityserviceprovider.adminEnableUser(params);
    return response;
  }catch(error){
    return error;
  }
};

/**
 * Disable User for a Tenant
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.disableUser = async function(tenant) {
  const { email } = tenant;
  var params = {
    UserPoolId: COGNITO_USER_POOL_WEB,
    Username: email
  };
  try {
    const response = cognitoidentityserviceprovider.adminDisableUser(params);
    return response;
  }catch(error){
    return error;
  }
};

/**
 * SignOut the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.signout = async function(tenant) {
  const { email } = tenant;
  var params = {
    UserPoolId: COGNITO_USER_POOL_WEB,
    Username: email
  };
  try {
    const response = cognitoidentityserviceprovider.adminUserGlobalSignOut(
      params
    );
    return response;
  } catch (error) {
    return error;
  }
};

module.exports.setPassword = async function(tenant) {
  const { email, passsword } = tenant;
  var params = {
    Password: passsword,
    UserPoolId: COGNITO_USER_POOL_WEB,
    Username: email,
    Permanent: true
  };
  try {
    const response = cognitoidentityserviceprovider.adminSetUserPassword(params);
    return response;
  }catch(error){
    return response;
  }
}
/**
 * Save the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.saveTenantDataToFaunadb = async function(tenant) {
  // get the tenant company_name
  const {
    email,
    tenant_id,
    location_id,
    location,
    firstName,
    lastName,
    role,
    tenant_name,
    tier
  } = tenant;
  // create the database with the company_name
  const dbName = await client.query(q.CreateDatabase({ name: tenant_name }));
  // create secret key to only access the collection
  const secretKey = await client.query(
    q.CreateKey({ database: q.Database(dbName.name), role: "admin" })
  );
  // create collection
  const collection = await CreateCollection({ name: "tenant-user" });
  // create index for the collection
  const index = await client.query(
    q.CreateIndex({
      name: companytenant_name_name + "TENANT",
      source: q.Collection(collection)
    })
  );
  const data = {
    email: email,
    tenant_id: tenant_id,
    location_id: location_id,
    location: location,
    given_name: firstName,
    family_name: lastName,
    role: role,
    tenant_name: companyName,
    tenant_faunadb_secret: secretKey.secret, // getting the secret returned from the createKey function
    tenant_faunadb_hash: secretKey.hashed_secret, // getting the hashed_secret returned from the createKey function
    tier: tier
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
  const { email, tenant_faunadb_secret, tenant_faunadb_hash_secret } = tenant.data;
  var params = {
    UserAttributes: [
      {
        Name: `custom:${tenant_faunadb_secret}`,
        Value: tenant_faunadb
      },
      {
        Name: `custom:${tenant_faunadb_hash_secret}`,
        Value: tenant_faunadb_hash
      }
    ],
    UserPoolId: COGNITO_USER_POOL_WEB,
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

