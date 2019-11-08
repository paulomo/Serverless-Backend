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

const USER_FIT_TABLE = process.env.USER_FIT_TABLE;

// Get Brand endpoint
app.get('/user-fits/health', function (req, res) {
	res.status(200).send({service: 'User Fit Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-fits/:userFitId', function (req, res) {
	winston.debug('Fetching user fit: ' + req.params.id);
	// init params structure with request params
	var params = {
		userFitId: req.params.id
	};
});

app.get("/user-fits/:userFitId", function(request, response) {
  const params = {
    TableName: USER_FIT_TABLE,
    Key: {
      userFitId: request.params.userFitId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-fits', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_FIT_TABLE,
		KeyConditionExpression: "userFitId = :userFitId",
		ExpressionAttributeValues: {
			":userFitId": req.params.userFitId
		}
	};
});

app.put('/user-fits', function (req, res) {
	winston.debug('Updating user fit: ' + req.body.userFitId);
	// init the params from the request data
	var keyParams = {
		userFitId: req.body.userFitId
	};
	winston.debug('Updating user fit: ' + req.body.userFitId);
	var saleUpdateParams = {
		TableName: userBrandSchema.TableName,
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

app.delete('/user-fits/:userFitId', function (req, res) {
	winston.debug('Deleting user brand: ' + req.params.id);
	// init parameter structure
	var deleteUserFitParams = {
		TableName: process.env.USER_FIT_TABLE,
		Key: {
			userFitId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

