const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

// UUID Generator Module
const uuidV4 = require("uuid/v4").default;
// Configure Logging
const winston = require("winston");

// AWS Services
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3(require("./s3config.js")());

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ strict: false }));

const SETTING_TABLE = process.env.SETTING_TABLE;

// Get Brand endpoint
app.get("/settings/health", function(req, res) {
  res.status(200).send({ service: "Sale Manager", isAlive: true });
});

/*
 ** RETRIVES ALL DATA FOR THE USER BASED TENANT AND/OR LOCATION IDENTITY
 */
app.get("/settings", function(req, res) {
  winston.debug("Fetching Sale: " + req.params.setting_id + " " + req.params.tenant_id + " " + req.params.location_id);
  
  // init params structure with request params
  var params = {
    TableName: SETTING_TABLE,
    key: {
      UserId: req.params.user_id,
      TenantId: req.params.tenant_id,
      LocationId: req.params.location_id,
    }
  };
});

/*
 ** RETRIVES ALL DATA FOR THE BASED ON TENANT AND/OR LOCATION IDENTITY
 */
app.get("/settings/:settingId", async function(request, response) {
  winston.debug("Fetching Sale: " + request.params.setting_id + " " + request.params.tenant_id + " " + request.params.location_id);

  // init params structure with request params
  const params = {
    TableName: SETTING_TABLE,
    Key: {
      UserId: request.params.user_id,
      TenantId: request.params.tenant_id,
      LocationId: request.params.location_id,
    }
  };

  try {
    const result = await getItem(params);
    response.send(result);
  }catch(error){
    response.send(result);
  }

});

app.get("/settings", function(req, res) {
  var searchParams = {
    TableName: process.env.SALE_TABLE,
    KeyConditionExpression: "Tenant_Id = :Tenant_Id",
    ExpressionAttributeValues: {
      ":SettingId": req.params.SettingId
    }
  };
});

app.put("/settings", function(req, res) {
  winston.debug("Updating sale: " + req.body.SettingId);
  // init the params from the request data
  var keyParams = {
    settingId: req.body.id,
    tenantId: req.body.tenant_id,
    locationId: req.body.location_id
  };
  winston.debug("Updating brand: " + req.body.SettingId);
  var settingUpdateParams = {
    TableName: settingschema.TableName,
    Key: keyParams,
    UpdateExpression:
      "set " +
      "sku=:sku, " +
      "title=:title, " +
      "description=:description, " +
      "#condition=:condition, " +
      "conditionDescription=:conditionDescription, " +
      "numberInStock=:numberInStock, " +
      "unitCost=:unitCost",
    ExpressionAttributeNames: {
      "#condition": "condition"
    },
    ExpressionAttributeValues: {
      ":sku": req.body.sku,
      ":title": req.body.title,
      ":description": req.body.description,
      ":condition": req.body.condition,
      ":conditionDescription": req.body.conditionDescription,
      ":numberInStock": req.body.numberInStock,
      ":unitCost": req.body.unitCost
    },
    ReturnValues: "UPDATED_NEW"
  };
});

app.delete("/settings/:SettingId", function(req, res) {
  winston.debug("Deleting product: " + req.params.id);
  // init parameter structure
  var deleteSettingParams = {
    TableName: process.env.SETTING_TABLE,
    Key: {
      settingId: req.params.id,
      tenantId: req.params.tenant_id,
      locationId: req.param.location_id
    }
  };
});

module.exports.handler = serverless(app);
