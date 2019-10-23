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

const CUSTOMER_SERVICE_TABLE = process.env.CUSTOMER_SERVICE_TABLE;

// Get Brand endpoint
app.get('/customers/health', function (req, res) {
	res.status(200).send({service: 'customer Manager', isAlive: true});
});

// Create REST entry points
app.get('/customers/:id', function (req, res) {
	winston.debug('Fetching customer: ' + req.params.id);
	// init params structure with request params
	var params = {
		customerId: req.params.id
	};
});

app.get("/customers/:customerId", function(request, response) {
  const params = {
    TableName: CUSTOMER_SERVICE_TABLE,
    Key: {
      customerId: request.params.customerId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/customers', function (req, res) {
	var searchParams = {
		TableName: process.env.CUSTOMER_SERVICE_TABLE,
		KeyConditionExpression: "customerId = :customerId",
		ExpressionAttributeValues: {
			":customerId": req.params.customerId
		}
	};
});

app.put('/customers', function (req, res) {
	winston.debug('Updating customer: ' + req.body.customerId);
	// init the params from the request data
	var keyParams = {
		customerId: req.body.customerId
	};
	winston.debug('Updating customer: ' + req.body.customerId);
	var saleUpdateParams = {
		TableName: customerschema.TableName,
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

app.delete('/customers/:customerId', function (req, res) {
	winston.debug('Deleting customer: ' + req.params.id);
	// init parameter structure
	var deleteCustomerParams = {
		TableName: process.env.CUSTOMER_SERVICE_TABLE,
		Key: {
			customerId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

