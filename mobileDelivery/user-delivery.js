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

const USER_DELIVERY_TABLE = process.env.USER_DELIVERY_TABLE;

// Get Brand endpoint
app.get('/user-deliveries/health', function (req, res) {
	res.status(200).send({service: 'User Delivery Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-deliveries/:userDeliveryId', function (req, res) {
	winston.debug('Fetching user delivery: ' + req.params.id);
	// init params structure with request params
	var params = {
		userDeliveryId: req.params.id
	};
});

app.get("/user-deliveries/:userDeliveryId", function(request, response) {
  const params = {
    TableName: USER_DELIVERY_TABLE,
    Key: {
      userDeliveryId: request.params.userDeliveryId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-deliveries', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_DELIVERY_TABLE,
		KeyConditionExpression: "userDeliveryId = :userDeliveryId",
		ExpressionAttributeValues: {
			":userDeliveryId": req.params.userDeliveryId
		}
	};
});

app.put('/user-deliveries', function (req, res) {
	winston.debug('Updating user delivery: ' + req.body.userDeliveryId);
	// init the params from the request data
	var keyParams = {
		userDeliveryId: req.body.userDeliveryId
	};
	winston.debug('Updating user delivery: ' + req.body.userDeliveryId);
	var deliveryUpdateParams = {
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

app.delete('/user-deliveries/:userDeliveryId', function (req, res) {
	winston.debug('Deleting user delivery: ' + req.params.id);
	// init parameter structure
	var deleteUserDeliveryParams = {
		TableName: process.env.USER_DELIVERY_TABLE,
		Key: {
			userDeliveryId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

