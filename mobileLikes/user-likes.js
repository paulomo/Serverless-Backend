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

const USER_BRAND_TABLE = process.env.USER_BRAND_TABLE;

// Get Brand endpoint
app.get('/user-brands/health', function (req, res) {
	res.status(200).send({service: 'userBrand Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-brands/:id', function (req, res) {
	winston.debug('Fetching user brand: ' + req.params.id);
	// init params structure with request params
	var params = {
		userBrandId: req.params.id
	};
});

app.get("/user-brands/:userBrandId", function(request, response) {
  const params = {
    TableName: USER_BRAND_TABLE,
    Key: {
      userBrandId: request.params.userBrandId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-brands', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_BRAND_TABLE,
		KeyConditionExpression: "userBrandId = :userBrandId",
		ExpressionAttributeValues: {
			":userBrandId": req.params.userBrandId
		}
	};
});

app.put('/user-brands', function (req, res) {
	winston.debug('Updating user brand: ' + req.body.userBrandId);
	// init the params from the request data
	var keyParams = {
		userBrandId: req.body.userBrandId
	};
	winston.debug('Updating user brand: ' + req.body.userBrandId);
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

app.delete('/user-brands/:userBrandId', function (req, res) {
	winston.debug('Deleting user brand: ' + req.params.id);
	// init parameter structure
	var deleteUserBrandParams = {
		TableName: process.env.USER_BRAND_TABLE,
		Key: {
			userBrandId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

