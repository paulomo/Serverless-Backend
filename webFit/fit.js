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

const FIT_TABLE = process.env.FIT_TABLE;

// Get Brand endpoint
app.get('/fits/health', function (req, res) {
	res.status(200).send({service: 'Fit Manager', isAlive: true});
});

// Create REST entry points
app.get('/fits/:id', function (req, res) {
	winston.debug('Fetching fit: ' + req.params.id);
	// init params structure with request params
	var params = {
		fitId: req.params.id
	};
});

app.get("/fits/:fitId", function(request, response) {
  const params = {
    TableName: FIT_TABLE,
    Key: {
      fitId: request.params.fitId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/fits', function (req, res) {
	var searchParams = {
		TableName: process.env.FIT_TABLE,
		KeyConditionExpression: "fitId = :fitId",
		ExpressionAttributeValues: {
			":fitId": req.params.fitId
		}
	};
});

app.put('/fits', function (req, res) {
	winston.debug('Updating fit: ' + req.body.fitId);
	// init the params from the request data
	var keyParams = {
		fitId: req.body.fitId
	};
	winston.debug('Updating fit: ' + req.body.fitId);
	var saleUpdateParams = {
		TableName: fitschema.TableName,
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

app.delete('/fits/:fitId', function (req, res) {
	winston.debug('Deleting fit: ' + req.params.id);
	// init parameter structure
	var deleteFitParams = {
		TableName: process.env.FIT_TABLE,
		Key: {
			fitId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

