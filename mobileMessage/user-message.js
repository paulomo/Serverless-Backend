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

const USER_MESSAGE_TABLE = process.env.USER_MESSAGE_TABLE;

// Get Brand endpoint
app.get('/user-messages/health', function (req, res) {
	res.status(200).send({service: 'User Message Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-messages/:id', function (req, res) {
	winston.debug('Fetching user message: ' + req.params.id);
	// init params structure with request params
	var params = {
		userBrandId: req.params.id
	};
});

app.get("/user-messages/:userMessageId", function(request, response) {
  const params = {
    TableName: USER_MESSAGE_TABLE,
    Key: {
      userBrandId: request.params.userBrandId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-messages', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_MESSAGE_TABLE,
		KeyConditionExpression: "userMessageId = :userMessageId",
		ExpressionAttributeValues: {
			":userMessageId": req.params.userBrandId
		}
	};
});

app.put('/user-messages', function (req, res) {
	winston.debug('Updating user message: ' + req.body.userBrandId);
	// init the params from the request data
	var keyParams = {
		userBrandId: req.body.userBrandId
	};
	winston.debug('Updating user message: ' + req.body.userBrandId);
	var saleUpdateParams = {
		TableName: userMessageSchema.TableName,
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

app.delete('/user-messages/:userMessageId', function (req, res) {
	winston.debug('Deleting user message: ' + req.params.id);
	// init parameter structure
	var deleteUserMessageParams = {
		TableName: process.env.USER_MESSAGE_TABLE,
		Key: {
			userBrandId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

