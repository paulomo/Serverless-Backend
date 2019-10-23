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

// Create a schema
var productTableSchema = {
	TableName: process.env.PRODUCT_TABLE,
	KeySchema: [
		{AttributeName: "productId", KeyType: "HASH"}  //Partition key
	],
	AttributeDefinitions: [
		{AttributeName: "productId", AttributeType: "S"}
	],
	ProvisionedThroughput: {
		ReadCapacityUnits: 10,
		WriteCapacityUnits: 10
	}
};

app.get('/product/health', function (req, res) {
	res.status(200).send({service: 'Product Manager', isAlive: true});
});

// Create REST entry points
app.get('/product/:id', function (req, res) {
	winston.debug('Fetching product: ' + req.params.id);
	// init params structure with request params
	var params = {
		productId: req.params.id
	};
});

app.get('/products', function (req, res) {
	var searchParams = {
		TableName: process.env.PRODUCT_TABLE,
		KeyConditionExpression: "productId = :productId",
		ExpressionAttributeValues: {
			":productId": req.params.productId
		}
	};
});

app.post('/product', function (req, res) {
	var product = req.body;
	product.productId = uuidV4();
});

app.put('/product', function (req, res) {
	winston.debug('Updating product: ' + req.body.productId);
	// init the params from the request data
	var keyParams = {
		productId: req.body.productId
	};
	winston.debug('Updating product: ' + req.body.productId);
	var productUpdateParams = {
		TableName: process.env.PRODUCT_TABLE,
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

app.delete('/product/:id', function (req, res) {
	winston.debug('Deleting product: ' + req.params.id);
	// init parameter structure
	var deleteProductParams = {
		TableName: process.env.PRODUCT_TABLE,
		Key: {
			productId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);