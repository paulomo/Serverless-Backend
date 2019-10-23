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

const SALE_TABLE = process.env.SALE_TABLE;

// Get Brand endpoint
app.get('/sales/health', function (req, res) {
	res.status(200).send({service: 'Sale Manager', isAlive: true});
});

// Create REST entry points
app.get('/sales/:id', function (req, res) {
	winston.debug('Fetching Sale: ' + req.params.id);
	// init params structure with request params
	var params = {
		saleId: req.params.id
	};
});

app.get("/sales/:saleId", function(request, response) {
  const params = {
    TableName: SALE_TABLE,
    Key: {
      saleId: request.params.saleId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/sales', function (req, res) {
	var searchParams = {
		TableName: process.env.SALE_TABLE,
		KeyConditionExpression: "saleId = :saleId",
		ExpressionAttributeValues: {
			":saleId": req.params.saleId
		}
	};
});

app.put('/sales', function (req, res) {
	winston.debug('Updating sale: ' + req.body.saleId);
	// init the params from the request data
	var keyParams = {
		saleId: req.body.saleId
	};
	winston.debug('Updating brand: ' + req.body.saleId);
	var saleUpdateParams = {
		TableName: saleschema.TableName,
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

app.delete('/sales/:saleId', function (req, res) {
	winston.debug('Deleting product: ' + req.params.id);
	// init parameter structure
	var deleteSaleParams = {
		TableName: process.env.SALE_TABLE,
		Key: {
			productId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

