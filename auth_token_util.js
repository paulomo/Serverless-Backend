const AWS = require("aws-sdk");
const { ValidationError } = require("./error");

// AWS Services
AWS.config.update({ region: "us-east-1" });

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});

// ******************************* TOKEN *********************************

/**
 * Determine if a tenant can be created (they may already exist)
 * @param params The tenant data
 * @returns True if the tenant exists
 */
module.exports.checkUniqueTenantNameOnSignUp = async function (tenat) {
  const { tenant_name } = tenant;
  const params = {
    preferred_username
  }
  const nameExist = await userExist(params);
  if (nameExist === tenant_name) {
    return ValidationError("Name already Exist");
  }
}

/**
 * Determine if a tenant can be created (they may already exist)
 * @param params The tenant data
 * @returns True if the tenant exists
 */
module.exports.userExist = async function(params) {
  cognitoidentityserviceprovider.listUsers(params, function(err, data) {
    if (err) {
      return err; // an error occurred
    } else {
      return data; // successful response
    }
  });
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


