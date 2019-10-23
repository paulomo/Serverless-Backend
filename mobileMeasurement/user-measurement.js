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

const USER_MEASUREMENT_TABLE = process.env.USER_MEASUREMENT_TABLE;

// Get Brand endpoint
app.get('/user-measurements/health', function (req, res) {
	res.status(200).send({service: 'userBrand Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-measurements/:userMeasurementId', function (req, res) {
	winston.debug('Fetching user Measurement: ' + req.params.id);
	// init params structure with request params
	var params = {
		userMeasurementId: req.params.id
	};
});

app.get("/user-measurements/:userMeasurementId", function(request, response) {
  const params = {
    TableName: USER_MEASUREMENT_TABLE,
    Key: {
      userMeasurementId: request.params.userMeasurementId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-measurements', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_MEASUREMENT_TABLE,
		KeyConditionExpression: "userMeasurementId = :userMeasurementId",
		ExpressionAttributeValues: {
			":userMeasurementId": req.params.userMeasurementId
		}
	};
});

app.put('/user-measurements', function (req, res) {
	winston.debug('Updating User Measurement: ' + req.body.userMeasurementId);
	// init the params from the request data
	var keyParams = {
		userMeasurementId: req.body.userMeasurementId
	};
	winston.debug('Updating User Measurement: ' + req.body.userMeasurementId);
	var measurementUpdateParams = {
		TableName: userMeasurementSchema.TableName,
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

app.delete('/user-measurements/:userMeasurementId', function (req, res) {
	winston.debug('Deleting User Measurement: ' + req.params.id);
	// init parameter structure
	var deleteUserMeasurementParams = {
		TableName: process.env.USER_MEASUREMENT_TABLE,
		Key: {
			userMeasurementId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

