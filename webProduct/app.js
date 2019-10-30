const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

// UUID Generator Module
const uuidV4 = require("uuid/v4");
// Configure Logging
const winston = require("winston");

// AWS Services
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3(require("./s3config.js")());

var bearerToken = "";
var tenantId = "";
var locationId = "";
const PRODUCT_TABLE = process.env.PRODUCT_TABLE;

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  bearerToken = req.get("Authorization");
  if (bearerToken) {
    tenantId = getTenantId(req);
    locationId = getLocationId(req);
  }
  next();
});

app.get("/product/health", function(req, res) {
  res.status(200).send({ service: "Product Manager", isAlive: true });
});

/*
 ** GET PRODUCT FOR A LOCATION
 */
app.get("/products/location/:locationId/product/:id", function(
  request,
  response
) {
  winston.debug("Fetching product: " + request.params.productId);
  // init params structure with request params
  var params = {
    tenantId: tenantId,
    productId: req.params.productId,
    locationId: req.params.locationId
  };
});

app.get("/products", function(req, res) {
  var searchParams = {
    TableName: process.env.PRODUCT_TABLE,
    KeyConditionExpression: "productId = :productId",
    ExpressionAttributeValues: {
      ":productId": req.params.productId
    }
  };
});

app.post("/product", async function(request, response) {
  var product = request.body;
  product.productId = uuidV4();
  product.tenantId = request.body.tenantId;
  product.tenantId = tenantId;
  product.locationId = request.body.locationId;
  product.locationId = locationId
  var params = {
    TableName: PRODUCT_TABLE,
    Item: {
      product: product
    }
  };
  try {
    const result = await addItem(params);
    response.send(result);
  } catch (error) {
    response.send(error);
  }
});

app.put("/product", function(req, res) {
  winston.debug("Updating product: " + req.body.productId);
  // init the params from the request data
  var keyParams = {
    productId: req.body.productId
  };
  winston.debug("Updating product: " + req.body.productId);
  var productUpdateParams = {
    TableName: process.env.PRODUCT_TABLE,
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

app.delete("/product/:id", function(req, res) {
  winston.debug("Deleting product: " + req.params.id);
  // init parameter structure
  var deleteProductParams = {
    TableName: process.env.PRODUCT_TABLE,
    Key: {
      productId: req.params.id
    }
  };
});

module.exports.handler = serverless(app);
