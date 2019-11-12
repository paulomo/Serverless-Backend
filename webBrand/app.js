const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

// UUID Generator Module
const uuidV4 = require('uuid/v4').default;
// Configure Logging
const winston = require('winston');

// AWS Services
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3(require("./s3config.js")());

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ strict: false }));

const BRAND_TABLE = process.env.BRAND_TABLE;

// Get Brand endpoint
app.get('/brand/health', function (req, res) {
	res.status(200).send({service: 'Product Manager', isAlive: true});
});

// Create REST entry points
app.get('/brand/:id', function (req, res) {
	winston.debug('Fetching product: ' + req.params.id);
	// init params structure with request params
	var params = {
		productId: req.params.id
	};
});

app.get("/brands/:brandId", function(request, response) {
  const params = {
    TableName: BRAND_TABLE,
    Key: {
      brandId: request.params.brandId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/brands', function (req, res) {
	var searchParams = {
		TableName: process.env.BRAND_TABLE,
		KeyConditionExpression: "productId = :productId",
		ExpressionAttributeValues: {
			":productId": req.params.productId
		}
	};
});

app.put('/brands', function (req, res) {
	winston.debug('Updating product: ' + req.body.brandId);
	// init the params from the request data
	var keyParams = {
		productId: req.body.brandId
	};
	winston.debug('Updating brand: ' + req.body.brandId);
	var productUpdateParams = {
		TableName: productSchema.TableName,
		Key: keyParams,
		UpdateExpression: "set " +
				"sku=:sku, " +
				"title=:title, " +
				"description=:description, " +
				"#condition=:condition, " +
				"conditionDescription=:conditionDescription, " +
				"numberInStock=:numberInStock, " +
				"unitCost=:unitCost",
		ExpressionAttributeNames: {
			'#condition': 'condition'
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

app.delete('/brand/:id', function (req, res) {
	winston.debug('Deleting product: ' + req.params.id);
	// init parameter structure
	var deleteProductParams = {
		TableName: process.env.BRAND_TABLE,
		Key: {
			productId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

