const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

// ******************************* DYNAMODB *********************************

module.exports.addItem = async function(data) {
  try {
    const response = await docClient.put(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};

module.exports.getItem = async function(params) {
  try {
    const response = await docClient.get(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};

module.exports.updateItem = async function(params) {
  try {
    const response = await docClient.update(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};

module.exports.deleteItem = async function(params) {
  try {
    const response = await docClient.delete(params);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return JSON.stringify(error, null, 2);
  }
};
