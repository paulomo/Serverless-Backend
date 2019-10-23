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

const USER_PURCHASE_TABLE = process.env.USER_PURCHASE_TABLE;

// Get Brand endpoint
app.get('/user-purchases/health', function (req, res) {
	res.status(200).send({service: 'userBrand Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-purchases/userPurchaseId', function (req, res) {
	winston.debug('Fetching user purchase: ' + req.params.id);
	// init params structure with request params
	var params = {
		userPurchaseId: req.params.id
	};
});

app.get("/user-purchases/:userPurchaseId", function(request, response) {
  const params = {
    TableName: USER_PURCHASE_TABLE,
    Key: {
      userPurchaseId: request.params.userPurchaseId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-purchases', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_PURCHASE_TABLE,
		KeyConditionExpression: "userPurchaseId = :userPurchaseId",
		ExpressionAttributeValues: {
			":userPurchaseId": req.params.userPurchaseId
		}
	};
});

app.put('/user-purchases', function (req, res) {
	winston.debug('Updating user purchase: ' + req.body.userPurchaseId);
	// init the params from the request data
	var keyParams = {
		userPurchaseId: req.body.userPurchaseId
	};
	winston.debug('Updating user purchase: ' + req.body.userPurchaseId);
	var purchaseUpdateParams = {
		TableName: userPurchaseSchema.TableName,
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

app.delete('/user-purchases/:userPurchaseId', function (req, res) {
	winston.debug('Deleting user purchase: ' + req.params.id);
	// init parameter structure
	var deleteUserPurchaseParams = {
		TableName: process.env.USER_PURCHASE_TABLE,
		Key: {
			userPurchaseId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

