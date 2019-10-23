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

const USER_CIRCLE_TABLE = process.env.USER_CIRCLE_TABLE;

// Get Brand endpoint
app.get('/user-circles/health', function (req, res) {
	res.status(200).send({service: 'User Circle Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-circles/:userCircleId', function (req, res) {
	winston.debug('Fetching user circle: ' + req.params.id);
	// init params structure with request params
	var params = {
		userCircleId: req.params.id
	};
});

app.get("/user-circles/:userCircleId", function(request, response) {
  const params = {
    TableName: USER_CIRCLE_TABLE,
    Key: {
      userCircleId: request.params.userCircleId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-circles', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_CIRCLE_TABLE,
		KeyConditionExpression: "userCircleId = :userCircleId",
		ExpressionAttributeValues: {
			":userCircleId": req.params.userCircleId
		}
	};
});

app.put('/user-circles', function (req, res) {
	winston.debug('Updating user circle: ' + req.body.userCircleId);
	// init the params from the request data
	var keyParams = {
		userCircleId: req.body.userCircleId
	};
	winston.debug('Updating user circle: ' + req.body.userCircleId);
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

app.delete('/user-circles/:userCircleId', function (req, res) {
	winston.debug('Deleting user circle: ' + req.params.id);
	// init parameter structure
	var deleteUserCircleParams = {
		TableName: process.env.USER_CIRCLE_TABLE,
		Key: {
			userCircleId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

