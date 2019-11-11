const AWS = require("aws-sdk");
const jwtDecode = require("jwt-decode");

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

// ******************************* DYNAMODB *********************************

module.exports.addItem = async function(params, credentials) {
  try {
    const response = await client.put(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};

module.exports.getItem = async function(params, credentials) {
  try {
    const response = await client.get(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};

module.exports.updateItem = async function(params, credentials) {
  try {
    const response = await client.update(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};

module.exports.deleteItem = async function(params, credentials) {
  try {
    const response = await client.delete(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};

module.exports.getCredentials = function(data) {

}

/* credentials: contains the data field gotten from the Authorize Header
 * returns { ref: Ref(id=db-next, collection=Ref(id=databases)),ts: 1527274824500534, name: databasename}
*/
module.exports.createDatabase = async function(credentials) {
    const { company_name, tenant_faunadb } = credentials;
    const response = client.query(q.CreateDatabase({ 
        name: company_name, 
        data: credentials
    }))
    return response;
}

/* credentials: contains the data field gotten from the Authorize Header
 * returns { ref: Ref(id=db-next, collection=Ref(id=databases)),ts: 1527274824500534, name: databasename}
*/
module.exports.createCollection = async function(paramObject, credentials) {
    const { company_name, tenant_faunadb } = credentials;
    const response = client.query(q.createCollection(paramObject))
    return response;
}

/* credentials: contains the data field gotten from the Authorize Header
 * returns { ref: Ref(id=db-next, collection=Ref(id=databases)),ts: 1527274824500534, name: databasename}
*/
module.exports.createIndex = async function(paramObject, credentials) {
    const { company_name, tenant_faunadb } = credentials;
    const response = client.query(q.createCollection(paramObject))
    return response;
}

/* credentials: contains the data field gotten from the Authorize Header
 * returns { ref: Ref(id=db-next, collection=Ref(id=databases)),ts: 1527274824500534, name: databasename}
*/
module.exports.createIndex = async function(paramObject, credentials) {
    const { company_name, tenant_faunadb } = credentials;
    const response = client.query(q.createCollection(paramObject))
    return response;
}

/* credentials: contains the data field gotten from the Authorize Header
 * returns { ref: Ref(id=db-next, collection=Ref(id=databases)),ts: 1527274824500534, name: databasename}
*/
module.exports.getDataByID = async function(dataArray, credentials) {
    var result = [];
    dataArray.map(id => {
        try {
            const response = await this.getItem(id, credentials);
            const data = response.data;
            result.push(data);
        }catch(error){
            return result.push(error);
        }
    });
}