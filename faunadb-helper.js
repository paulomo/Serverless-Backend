// AWS Services
const AWS = require("aws-sdk");
const S3 = new AWS.S3(require("./s3config.js")());

// Setup FaunaDB
var faunadb = require("faunadb"),q = faunadb.query;
const FAUNADB_SECRET = process.env.FAUNADB_SECRET;
var client = new faunadb.Client({ secret: FAUNADB_SECRET });

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